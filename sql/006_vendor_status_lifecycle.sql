-- =====================================================
-- 006: Vendor onboarding lifecycle
-- under_review → approved → qualified (| rejected)
-- =====================================================

-- Status on vendor_profiles
DO $$ BEGIN
  CREATE TYPE public.vendor_onboarding_status AS ENUM (
    'under_review',
    'approved',
    'qualified',
    'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.vendor_profiles
  ADD COLUMN IF NOT EXISTS onboarding_status public.vendor_onboarding_status
    NOT NULL DEFAULT 'under_review';

ALTER TABLE public.vendor_profiles
  ADD COLUMN IF NOT EXISTS review_notes TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT;

COMMENT ON COLUMN public.vendor_profiles.onboarding_status IS
  'under_review = just signed up; approved = verified, light portal; qualified = can bid on RFQs; rejected = denied';

CREATE INDEX IF NOT EXISTS idx_vendor_onboarding_status
  ON public.vendor_profiles (onboarding_status);

-- Redeem invite after successful signup (increment use, bind user)
CREATE OR REPLACE FUNCTION public.redeem_vendor_invite(
  p_code TEXT,
  p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v public.vendor_invites%ROWTYPE;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'no_user');
  END IF;

  SELECT * INTO v
  FROM public.vendor_invites
  WHERE upper(trim(code)) = upper(trim(p_code))
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  IF v.is_active IS NOT TRUE THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'inactive');
  END IF;

  IF v.expires_at IS NOT NULL AND v.expires_at < NOW() THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'expired');
  END IF;

  IF v.used_count >= v.max_uses THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'exhausted');
  END IF;

  UPDATE public.vendor_invites
  SET
    used_count = used_count + 1,
    redeemed_by = COALESCE(redeemed_by, p_user_id),
    redeemed_at = COALESCE(redeemed_at, NOW()),
    updated_at = NOW(),
    is_active = CASE WHEN used_count + 1 >= max_uses THEN false ELSE is_active END
  WHERE id = v.id;

  RETURN jsonb_build_object('ok', true, 'invite_id', v.id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.redeem_vendor_invite(TEXT, UUID) TO authenticated;

-- Admin / platform: set vendor status
CREATE OR REPLACE FUNCTION public.set_vendor_onboarding_status(
  p_organization_id UUID,
  p_status public.vendor_onboarding_status,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller UUID := auth.uid();
  is_admin BOOLEAN;
BEGIN
  IF caller IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_authenticated');
  END IF;

  -- platform admin check (profiles.role or platform_admins table if exists)
  SELECT EXISTS (
    SELECT 1 FROM public.profiles pr
    WHERE pr.id = caller
      AND pr.role IN ('platform_admin', 'admin', 'super_admin')
  ) INTO is_admin;

  IF NOT is_admin THEN
    -- also allow platform_admins table
    BEGIN
      SELECT EXISTS (
        SELECT 1 FROM public.platform_admins pa WHERE pa.user_id = caller
      ) INTO is_admin;
    EXCEPTION WHEN undefined_table THEN
      is_admin := is_admin;
    END;
  END IF;

  IF NOT is_admin THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'forbidden');
  END IF;

  UPDATE public.vendor_profiles
  SET
    onboarding_status = p_status,
    review_notes = COALESCE(p_notes, review_notes),
    reviewed_at = NOW(),
    reviewed_by = caller,
    updated_at = NOW(),
    vendor_tier = CASE
      WHEN p_status = 'qualified' THEN 'full'
      WHEN p_status IN ('approved', 'under_review') THEN 'simple'
      ELSE vendor_tier
    END,
    is_certified_partner = (p_status = 'qualified')
  WHERE organization_id = p_organization_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'vendor_not_found');
  END IF;

  RETURN jsonb_build_object('ok', true, 'status', p_status);
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_vendor_onboarding_status(UUID, public.vendor_onboarding_status, TEXT)
  TO authenticated;

-- Helper: current user's vendor org + status
CREATE OR REPLACE FUNCTION public.get_my_vendor_context()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller UUID := auth.uid();
  result JSONB;
BEGIN
  IF caller IS NULL THEN
    RETURN jsonb_build_object('is_vendor', false);
  END IF;

  SELECT jsonb_build_object(
    'is_vendor', true,
    'organization_id', o.id,
    'organization_name', o.name,
    'country_code', o.country_code,
    'onboarding_status', vp.onboarding_status,
    'vendor_tier', vp.vendor_tier,
    'specialties', to_jsonb(vp.specialties),
    'review_notes', vp.review_notes,
    'reviewed_at', vp.reviewed_at,
    'is_certified_partner', vp.is_certified_partner
  )
  INTO result
  FROM public.organization_members om
  JOIN public.organizations o ON o.id = om.organization_id AND o.type IN ('vendor', 'both')
  JOIN public.vendor_profiles vp ON vp.organization_id = o.id
  WHERE om.user_id = caller
  ORDER BY om.is_primary DESC NULLS LAST
  LIMIT 1;

  IF result IS NULL THEN
    RETURN jsonb_build_object('is_vendor', false);
  END IF;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_vendor_context() TO authenticated;

-- Seed sample invite for testing (safe if exists)
INSERT INTO public.vendor_invites (code, max_uses, company_hint, notes, is_active)
VALUES ('REVWA-PARTNER', 100, NULL, 'Default partner invite — rotate in production', true)
ON CONFLICT (code) DO NOTHING;
