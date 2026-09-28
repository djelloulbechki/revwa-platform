# REVWA OAuth Login Setup

## What changed

The public `/login` page now supports:

- Continue with Google
- Continue with LinkedIn
- Email/password login

Google and LinkedIn sign-in now use the shared callback:

`/auth/callback`

The callback reads the authenticated user's `profiles.role` and routes:

- `platform_admin` -> `/admin`
- `vendor_admin` -> `/vendor`
- everything else (including `buyer_member`) -> `/buyer`

If `revwa_vendor_pending_org` exists in localStorage, the callback sends the user to:

`/vendor/onboarding-complete`

This preserves the invited-vendor OAuth onboarding flow.

## Supabase Redirect URLs

In Supabase Dashboard -> Authentication -> URL Configuration -> Redirect URLs, add:

```text
https://www.revwa.com/auth/callback
https://revwa.com/auth/callback
http://localhost:5173/auth/callback
```

Set the Site URL to the production canonical URL used by the app, normally:

```text
https://www.revwa.com
```

## Provider configuration

Google and LinkedIn OIDC must be enabled in Supabase Authentication -> Providers.

The OAuth provider's callback/redirect configuration should use the Supabase project's standard Auth callback URL shown in the Supabase provider settings. The application-level redirect above (`/auth/callback`) is the URL passed by the REVWA frontend after Supabase completes the provider flow.

## Important

Do not add `/admin`, `/vendor`, or `/buyer` as OAuth callback URLs for this flow. They are destination pages, not the OAuth callback.
