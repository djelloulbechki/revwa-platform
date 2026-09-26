-- =====================================================
-- 004: Dedicated Platform Admins (separate from profiles)
-- Run after 001, 002, 003
-- =====================================================

-- Admin status + optional job title inside REVWA team
DO $$ BEGIN
  CREATE TYPE platform_admin_status AS ENUM ('active', 'suspended', 'invited');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.platform_admins (
  id UUID PRIMARY KEY DEFAULT public.generate_uuid_v7(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Identity inside the platform team
  display_name TEXT,
  title TEXT,                          -- e.g. Owner, Ops, Scoper
  status platform_admin_status NOT NULL DEFAULT 'active',
  -- Super-owner: full power; others use permissions JSON
  is_super_admin BOOLEAN NOT NULL DEFAULT false,
  -- Granular flags for future roles (easy to extend)
  permissions JSONB NOT NULL DEFAULT '{
    "requests:read": true,
    "requests:write": true,
    "scoping:write": true,
    "rfq:send": true,
    "vendors:read": true,
    "vendors:verify": false,
    "deals:read": true,
    "deals:write": false,
    "commissions:read": true,
    "commissions:write": false,
    "admins:manage": false
  }'::jsonb,
  invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_admins_user ON public.platform_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_admins_status ON public.platform_admins(status);

DROP TRIGGER IF EXISTS set_updated_at_platform_admins ON public.platform_admins;
CREATE TRIGGER set_updated_at_platform_admins
  BEFORE UPDATE ON public.platform_admins
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------
-- Helper: is this auth user an active platform admin?
-- Prefer this over profiles.role for authorization
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.platform_admins pa
    WHERE pa.user_id = auth.uid()
      AND pa.status = 'active'
  )
  OR EXISTS (
    -- backward compatible during migration
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'platform_admin'
      AND p.is_active = true
  );
$$;

-- Optional: check a single permission key
CREATE OR REPLACE FUNCTION public.admin_has(permission_key TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.platform_admins pa
    WHERE pa.user_id = auth.uid()
      AND pa.status = 'active'
      AND (
        pa.is_super_admin = true
        OR COALESCE((pa.permissions ->> permission_key)::boolean, false) = true
      )
  );
$$;

-- -----------------------------------------------------
-- RLS
-- -----------------------------------------------------
ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read admin roster" ON public.platform_admins;
CREATE POLICY "Admins can read admin roster"
  ON public.platform_admins FOR SELECT
  USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Super admins manage roster" ON public.platform_admins;
CREATE POLICY "Super admins manage roster"
  ON public.platform_admins FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.platform_admins pa
      WHERE pa.user_id = auth.uid()
        AND pa.status = 'active'
        AND (pa.is_super_admin = true OR COALESCE((pa.permissions->>'admins:manage')::boolean, false))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.platform_admins pa
      WHERE pa.user_id = auth.uid()
        AND pa.status = 'active'
        AND (pa.is_super_admin = true OR COALESCE((pa.permissions->>'admins:manage')::boolean, false))
    )
  );

-- -----------------------------------------------------
-- BOOTSTRAP (run once manually with YOUR user id):
-- -----------------------------------------------------
-- 1) Sign up / create the owner account via Auth
-- 2) Ensure profiles row exists for that user
-- 3) Insert:
--
-- INSERT INTO public.platform_admins (user_id, display_name, title, is_super_admin, status)
-- VALUES (
--   'YOUR-AUTH-USER-UUID',
--   'Owner',
--   'Owner',
--   true,
--   'active'
-- );
--
-- Optional: also set profiles.role = 'platform_admin' for UI hints
-- UPDATE public.profiles SET role = 'platform_admin' WHERE id = 'YOUR-AUTH-USER-UUID';
