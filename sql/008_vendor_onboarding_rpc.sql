-- =====================================================
-- 008: Secure vendor onboarding RPC
--
-- Vendor signup previously attempted direct INSERTs into
-- organizations / organization_members / vendor_profiles.
-- RLS intentionally did not allow those INSERTs.
--
-- This RPC performs the complete onboarding atomically under
-- SECURITY DEFINER and binds every operation to auth.uid().
-- =====================================================

CREATE OR REPLACE FUNCTION public.create_vendor_organization(
  p_company_name TEXT,
  p_country_code CHAR(2),
  p_website TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_specialties TEXT[] DEFAULT ARRAY[]::TEXT[],
  p_contact_email TEXT DEFAULT NULL,
  p_invite_code TEXT DEFAULT NULL,
  p_full_name TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_org_id UUID;
  v_invite public.vendor_invites%ROWTYPE;
  v_country CHAR(2);
  v_name TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;

  v_name := NULLIF(btrim(p_company_name), '');
  v_country := upper(NULLIF(btrim(p_country_code::TEXT), ''))::CHAR(2);

  IF v_name IS NULL THEN
    RAISE EXCEPTION 'company_name_required' USING ERRCODE = '22023';
  END IF;

  IF v_country IS NULL OR length(v_country::TEXT) <> 2 THEN
    RAISE EXCEPTION 'valid_country_code_required' USING ERRCODE = '22023';
  END IF;

  -- Vendor onboarding is invitation-only. Lock the invite row so two
  -- concurrent signups cannot consume the same remaining invite slot.
  IF NULLIF(btrim(p_invite_code), '') IS NULL THEN
    RAISE EXCEPTION 'vendor_invite_required' USING ERRCODE = '42501';
  END IF;

  SELECT *
    INTO v_invite
  FROM public.vendor_invites
  WHERE upper(trim(code)) = upper(trim(p_invite_code))
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'vendor_invite_not_found' USING ERRCODE = '22023';
  END IF;

  IF v_invite.is_active IS NOT TRUE THEN
    RAISE EXCEPTION 'vendor_invite_inactive' USING ERRCODE = '22023';
  END IF;

  IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at < NOW() THEN
    RAISE EXCEPTION 'vendor_invite_expired' USING ERRCODE = '22023';
  END IF;

  IF v_invite.used_count >= v_invite.max_uses THEN
    RAISE EXCEPTION 'vendor_invite_exhausted' USING ERRCODE = '22023';
  END IF;

  IF v_invite.allowed_countries IS NOT NULL
     AND NOT (v_country = ANY(v_invite.allowed_countries)) THEN
    RAISE EXCEPTION 'country_not_allowed_for_vendor_invite' USING ERRCODE = '42501';
  END IF;

  -- Prevent duplicate organizations if the authenticated user already has
  -- a membership. This also makes the OAuth callback safely retryable.
  IF EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'user_already_has_organization' USING ERRCODE = '23505';
  END IF;

  INSERT INTO public.organizations (
    name,
    type,
    country_code,
    website,
    description,
    is_active
  )
  VALUES (
    v_name,
    'vendor',
    v_country,
    NULLIF(btrim(p_website), ''),
    NULLIF(btrim(p_description), ''),
    true
  )
  RETURNING id INTO v_org_id;

  INSERT INTO public.organization_members (
    organization_id,
    user_id,
    role,
    is_primary
  )
  VALUES (
    v_org_id,
    v_user_id,
    'vendor_admin',
    true
  );

  INSERT INTO public.vendor_profiles (
    organization_id,
    specialties,
    vendor_tier,
    onboarding_status,
    contact_email
  )
  VALUES (
    v_org_id,
    COALESCE(p_specialties, ARRAY[]::TEXT[]),
    'simple',
    'under_review',
    NULLIF(btrim(p_contact_email), '')
  );

  -- The auth trigger normally creates this row. Upsert makes the RPC safe
  -- when called immediately after OAuth/email signup as well.
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    activation_status,
    role
  )
  SELECT
    v_user_id,
    NULLIF(btrim(p_full_name), ''),
    COALESCE(NULLIF(btrim(p_contact_email), ''), au.email),
    'activated',
    'vendor_admin'
  FROM auth.users au
  WHERE au.id = v_user_id
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    activation_status = 'activated',
    role = 'vendor_admin',
    updated_at = NOW();

  UPDATE public.vendor_invites
  SET
    used_count = used_count + 1,
    redeemed_by = COALESCE(redeemed_by, v_user_id),
    redeemed_at = COALESCE(redeemed_at, NOW()),
    updated_at = NOW(),
    is_active = CASE
      WHEN used_count + 1 >= max_uses THEN false
      ELSE is_active
    END
  WHERE id = v_invite.id;

  RETURN jsonb_build_object(
    'ok', true,
    'organization_id', v_org_id,
    'invite_id', v_invite.id
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_vendor_organization(
  TEXT, CHAR(2), TEXT, TEXT, TEXT[], TEXT, TEXT, TEXT
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_vendor_organization(
  TEXT, CHAR(2), TEXT, TEXT, TEXT[], TEXT, TEXT, TEXT
) TO authenticated;
