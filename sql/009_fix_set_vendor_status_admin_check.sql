-- =====================================================
-- 009_fix_set_vendor_status_admin_check
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
BEGIN
  IF caller IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_authenticated');
  END IF;

  IF NOT public.is_platform_admin() THEN
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

  RETURN jsonb_build_object('ok', true, 'status', p_status::text);
END;
$$;