-- =====================================================
-- 003: Buyer (individual|company) + Vendor (company)
-- + Admin role clarity + DB-ready Vendor↔Buyer
-- Run AFTER 001_schema and 002_intake_activation
-- =====================================================

-- -----------------------------------------------------
-- A) ENUMs
-- -----------------------------------------------------
DO $$ BEGIN
  CREATE TYPE buyer_kind AS ENUM ('individual', 'company');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE activation_status_enum AS ENUM ('pending', 'activated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- -----------------------------------------------------
-- B) PROFILES — account only (person)
-- -----------------------------------------------------
-- contact_email + activation_status may already exist from 002
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Prefer enum if not already text-constrained
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles'
      AND column_name = 'activation_status'
      AND data_type = 'text'
  ) THEN
    -- keep text with check; or migrate to enum later
    NULL;
  ELSE
    ALTER TABLE public.profiles
      ADD COLUMN IF NOT EXISTS activation_status TEXT NOT NULL DEFAULT 'pending';
  END IF;
END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS preferred_locale TEXT DEFAULT 'en';

COMMENT ON COLUMN public.profiles.contact_email IS
  'Intake contact email. May differ from auth login email after OAuth.';
COMMENT ON COLUMN public.profiles.activation_status IS
  'pending = after anonymous submit; activated = linked identity or email+password';

-- Platform admin stays profiles.role = platform_admin (no separate table)

-- -----------------------------------------------------
-- C) BUYER PROFILES — mandatory for every buyer (person OR company lens)
--     Linked to user; optional organization when kind = company
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.buyer_profiles (
  id UUID PRIMARY KEY DEFAULT public.generate_uuid_v7(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind buyer_kind NOT NULL DEFAULT 'individual',
  -- Individual display
  display_name TEXT,
  -- Company fields (used when kind = company)
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  company_name TEXT,
  industry TEXT,
  company_size company_size,
  country_code CHAR(2),
  city TEXT,
  website TEXT,
  -- Procurement prefs
  typical_systems TEXT[] DEFAULT '{}',
  notes_internal TEXT,
  -- Formal tender / cahier des charges flag at profile level (optional)
  prefers_formal_specs BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT buyer_company_org_check CHECK (
    kind = 'individual'
    OR (kind = 'company' AND (organization_id IS NOT NULL OR company_name IS NOT NULL))
  )
);

CREATE INDEX IF NOT EXISTS idx_buyer_profiles_user ON public.buyer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_kind ON public.buyer_profiles(kind);
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_org ON public.buyer_profiles(organization_id)
  WHERE organization_id IS NOT NULL;

DROP TRIGGER IF EXISTS set_updated_at_buyer_profiles ON public.buyer_profiles;
CREATE TRIGGER set_updated_at_buyer_profiles
  BEFORE UPDATE ON public.buyer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------
-- D) PROJECT REQUESTS — support individual buyers + formal specs
-- -----------------------------------------------------
ALTER TABLE public.project_requests
  ALTER COLUMN buyer_organization_id DROP NOT NULL;

ALTER TABLE public.project_requests
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS has_formal_spec BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS formal_spec_url TEXT,
  ADD COLUMN IF NOT EXISTS buyer_kind buyer_kind DEFAULT 'individual';

COMMENT ON COLUMN public.project_requests.buyer_organization_id IS
  'Nullable until buyer is a company org or links an org. Individuals submit with created_by only.';
COMMENT ON COLUMN public.project_requests.has_formal_spec IS
  'True when client uploaded cahier des charges / tender pack.';

CREATE INDEX IF NOT EXISTS idx_project_requests_buyer_kind
  ON public.project_requests(buyer_kind);
CREATE INDEX IF NOT EXISTS idx_project_requests_formal
  ON public.project_requests(has_formal_spec) WHERE has_formal_spec = true;

-- -----------------------------------------------------
-- E) VENDOR — company only; DB-ready for later Buyer mode
--     vendor_profiles already exists (1:1 org)
-- -----------------------------------------------------
ALTER TABLE public.vendor_profiles
  ADD COLUMN IF NOT EXISTS work_methodology TEXT,
  ADD COLUMN IF NOT EXISTS privacy_policy_url TEXT,
  ADD COLUMN IF NOT EXISTS terms_url TEXT,
  ADD COLUMN IF NOT EXISTS exit_plan_summary TEXT,
  ADD COLUMN IF NOT EXISTS lock_in_policy TEXT,
  ADD COLUMN IF NOT EXISTS hidden_fees_policy TEXT,
  ADD COLUMN IF NOT EXISTS bankruptcy_contingency TEXT,
  ADD COLUMN IF NOT EXISTS document_process_summary TEXT,
  ADD COLUMN IF NOT EXISTS vendor_tier TEXT NOT NULL DEFAULT 'simple'
    CHECK (vendor_tier IN ('simple', 'full'));

COMMENT ON COLUMN public.vendor_profiles.vendor_tier IS
  'simple = lightweight onboard; full = certifications, case studies, policies filled';

-- organizations.type already supports buyer | vendor | both
-- Vendor→Buyer later: set type to both + create buyer_profiles for members (UI hidden for now)

-- -----------------------------------------------------
-- F) AUTO buyer_profile on new profile (individual default)
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.ensure_buyer_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.buyer_profiles (user_id, kind, display_name)
  VALUES (
    NEW.id,
    'individual',
    COALESCE(NEW.full_name, split_part(COALESCE(NEW.contact_email, NEW.email, ''), '@', 1))
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created_buyer ON public.profiles;
CREATE TRIGGER on_profile_created_buyer
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.ensure_buyer_profile();

-- Backfill existing profiles
INSERT INTO public.buyer_profiles (user_id, kind, display_name)
SELECT p.id, 'individual', COALESCE(p.full_name, p.contact_email, p.email)
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.buyer_profiles b WHERE b.user_id = p.id
)
ON CONFLICT (user_id) DO NOTHING;

-- -----------------------------------------------------
-- G) RLS
-- -----------------------------------------------------
ALTER TABLE public.buyer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own buyer_profile" ON public.buyer_profiles;
CREATE POLICY "Users manage own buyer_profile"
  ON public.buyer_profiles FOR ALL
  USING (user_id = auth.uid() OR public.is_platform_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_platform_admin());

-- Tighten project_requests: owner or admin or org member
DROP POLICY IF EXISTS "Users can insert own requests" ON public.project_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON public.project_requests;
DROP POLICY IF EXISTS "Users can update own requests" ON public.project_requests;
DROP POLICY IF EXISTS "Buyers can manage their requests" ON public.project_requests;

CREATE POLICY "Users can insert own requests"
  ON public.project_requests FOR INSERT
  WITH CHECK (created_by = auth.uid() OR public.is_platform_admin());

CREATE POLICY "Users can view own or org requests"
  ON public.project_requests FOR SELECT
  USING (
    public.is_platform_admin()
    OR created_by = auth.uid()
    OR (
      buyer_organization_id IS NOT NULL
      AND buyer_organization_id IN (SELECT public.get_user_org_ids())
    )
  );

CREATE POLICY "Users can update own or org requests"
  ON public.project_requests FOR UPDATE
  USING (
    public.is_platform_admin()
    OR created_by = auth.uid()
    OR (
      buyer_organization_id IS NOT NULL
      AND buyer_organization_id IN (SELECT public.get_user_org_ids())
    )
  );

-- Vendor policies already cover vendor_profiles via org membership

-- -----------------------------------------------------
-- H) NOTES (product, not SQL)
-- -----------------------------------------------------
-- • Vendor landing + dashboard: separate UI routes (/vendor/*)
-- • Vendor→Buyer switch: UI hidden; DB ready via organizations.type = 'both'
-- • Platform admin: dedicated entry path + role = platform_admin + RLS
-- • Odoo: optional later on subdomain; source of truth remains these tables
