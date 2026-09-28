# Vendor email-confirmation flow

The vendor email signup now redirects confirmed users to:

`/vendor/onboarding-complete`

The signup stores the pending vendor data in Supabase Auth user metadata and also keeps a localStorage fallback. This means the confirmation link can open in a new tab/browser without losing the vendor company/invitation context.

## Supabase Auth URL configuration

Add the production callback URL to Supabase Authentication > URL Configuration > Redirect URLs:

`https://www.revwa.com/vendor/onboarding-complete`

For local development, add the equivalent local callback URL, for example:

`http://localhost:5173/vendor/onboarding-complete`

Do not change `handle_new_user()` to assign `vendor_admin`. New auth users may initially be created as `buyer_member`; the vendor RPC is the authoritative step that creates the organization and upgrades the profile to `vendor_admin` after the invitation is validated.
