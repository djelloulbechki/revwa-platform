-- =====================================================
-- 002: Intake + Activation (Anonymous → Activated)
-- Run in Supabase SQL Editor after 001_schema
-- =====================================================

-- 1) Profiles: contact vs auth identity tracking
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS activation_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (activation_status IN ('pending', 'activated'));

COMMENT ON COLUMN public.profiles.contact_email IS
  'Email provided at intake for communication. May differ from auth.users.email after OAuth.';
COMMENT ON COLUMN public.profiles.activation_status IS
  'pending = anonymous/session only; activated = linked Google/LinkedIn/email+password';

CREATE INDEX IF NOT EXISTS idx_profiles_contact_email
  ON public.profiles (contact_email)
  WHERE contact_email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_activation
  ON public.profiles (activation_status);

-- 2) Allow project requests without org (pre-activation intake)
ALTER TABLE public.project_requests
  ALTER COLUMN buyer_organization_id DROP NOT NULL;

ALTER TABLE public.project_requests
  ADD COLUMN IF NOT EXISTS contact_email TEXT;

COMMENT ON COLUMN public.project_requests.contact_email IS
  'Snapshot of contact email at submit time for ops follow-up.';

CREATE INDEX IF NOT EXISTS idx_project_requests_created_by
  ON public.project_requests (created_by);

CREATE INDEX IF NOT EXISTS idx_project_requests_contact_email
  ON public.project_requests (contact_email)
  WHERE contact_email IS NOT NULL;

-- 3) Auto-create profile when auth.users is created (incl. anonymous)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, activation_status, contact_email)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NULL),
    'buyer_member',
    CASE
      WHEN COALESCE((NEW.raw_app_meta_data->>'provider') = 'anonymous', false)
        OR NEW.is_anonymous IS TRUE
      THEN 'pending'
      ELSE 'activated'
    END,
    COALESCE(NEW.raw_user_meta_data->>'contact_email', NEW.email)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4) When identity is linked / user upgraded, mark activated
CREATE OR REPLACE FUNCTION public.handle_user_activated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Non-anonymous user with an email → activated
  IF (NEW.is_anonymous IS NOT TRUE) AND (NEW.email IS NOT NULL) THEN
    UPDATE public.profiles
    SET
      activation_status = 'activated',
      email = COALESCE(NEW.email, email),
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_activated();

-- 5) RLS: user can insert own requests (anonymous or activated)
DROP POLICY IF EXISTS "Buyers can manage their requests" ON public.project_requests;

CREATE POLICY "Users can insert own requests"
  ON public.project_requests FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can view own requests"
  ON public.project_requests FOR SELECT
  USING (
    public.is_platform_admin()
    OR created_by = auth.uid()
    OR buyer_organization_id IN (SELECT public.get_user_org_ids())
  );

CREATE POLICY "Users can update own requests"
  ON public.project_requests FOR UPDATE
  USING (
    public.is_platform_admin()
    OR created_by = auth.uid()
    OR buyer_organization_id IN (SELECT public.get_user_org_ids())
  );

-- Profiles: allow insert via trigger (security definer); user updates own
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- 6) Storage: voice-recordings policies (create bucket in Dashboard if missing)
-- Bucket name: voice-recordings (private)
-- Policy example (run after bucket exists):
-- CREATE POLICY "Users upload own voice"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'voice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users read own voice"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'voice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);
