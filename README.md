# REVWA — Independent B2B Tech Procurement Desk

Fair tech deals. Clear scope. No surprises.

## Tech Stack
- React 19 + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth + Database + Storage)
- Lucide React
- React Router

## Design
- **Default**: Light mode (Dark mode supported)
- Fonts: Orbitron (headings) + Exo 2 (body)
- Brand: Purple primary

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/request` | Intake form (text + voice recording) |
| `/quote-audit` | Free quote audit |
| `/login` | Sign in |
| `/signup` | Create account |
| `/buyer` | Buyer Dashboard (list of requests) |
| `/buyer/requests/:id` | Request details + shortlisted proposals |
| `/vendor` | Vendor Portal (opportunities) |
| `/admin` | Admin Scoping Desk |

## Getting Started

```bash
npm install
cp .env.example .env
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

## Database
Use the full production schema (UUIDv7 + RLS + GIN indexes) provided earlier.

## Brand
**REVWA**
