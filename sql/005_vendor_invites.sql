-- =====================================================
-- 005: Vendor invitation codes (invite-only onboarding)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.vendor_invites (
  id UUID PRIMARY KEY DEFAULT public.generate_uuid_v7(),
  code TEXT NOT NULL UNIQUE,
  -- Optional limits
  max_uses INTEGER NOT NULL DEFAULT 1,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  -- Optional pre-assignment
  company_hint TEXT,
  allowed_countries CHAR(2)[] DEFAULT ARRAY['US','GB','IN','EG','SA','AE','QA','BH','KW','OM'],
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  redeemed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendor_invites_code ON public.vendor_invites (code);
CREATE INDEX IF NOT EXISTS idx_vendor_invites_active ON public.vendor_invites (is_active) WHERE is_active = true;

DROP TRIGGER IF EXISTS set_updated_at_vendor_invites ON public.vendor_invites;
CREATE TRIGGER set_updated_at_vendor_invites
  BEFORE UPDATE ON public.vendor_invites
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Validate invite (callable by anon during gate)
CREATE OR REPLACE FUNCTION public.validate_vendor_invite(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v public.vendor_invites%ROWTYPE;
BEGIN
  SELECT * INTO v
  FROM public.vendor_invites
  WHERE upper(trim(code)) = upper(trim(p_code))
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'not_found');
  END IF;

  IF v.is_active IS NOT TRUE THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'inactive');
  END IF;

  IF v.expires_at IS NOT NULL AND v.expires_at < NOW() THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'expired');
  END IF;

  IF v.used_count >= v.max_uses THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'exhausted');
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'invite_id', v.id,
    'company_hint', v.company_hint,
    'allowed_countries', to_jsonb(v.allowed_countries)
  );
END;
$$;

-- Allow anon/authenticated to call validation only
GRANT EXECUTE ON FUNCTION public.validate_vendor_invite(TEXT) TO anon, authenticated;

ALTER TABLE public.vendor_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage invites" ON public.vendor_invites;
CREATE POLICY "Admins manage invites"
  ON public.vendor_invites FOR ALL
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- Example seed (change code in production)
-- INSERT INTO public.vendor_invites (code, max_uses, company_hint, notes)
-- VALUES ('REVWA-PARTNER-2026', 50, NULL, 'Launch partners batch');
