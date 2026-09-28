# REVWA Vendor Onboarding Fix

## Database
Run `sql/008_vendor_onboarding_rpc.sql` in Supabase SQL Editor after the existing migrations.

The new `public.create_vendor_organization(...)` RPC is authenticated-only, invitation-only, and SECURITY DEFINER. It atomically creates:
- vendor organization
- primary vendor_admin membership
- vendor profile
- vendor_admin profile role
- invite redemption

It also validates invite expiry, usage limits, and allowed country.

## Frontend
Updated:
- `src/pages/vendor/Signup.tsx`
- `src/pages/vendor/OnboardingComplete.tsx`
- `src/pages/vendor/Login.tsx`

The frontend no longer performs direct RLS-protected INSERTs into organization tables and no longer silently ignores insert errors.

Email signup with Supabase email confirmation is also handled: pending vendor onboarding is retained in sessionStorage and completed after the user signs in.

## Important
Do NOT add broad `INSERT` policies to `organizations` or `organization_members` just to bypass the 403. The RPC is the intended write path for vendor onboarding.
