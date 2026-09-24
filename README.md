# REVWA — Independent B2B Tech Procurement Desk

Fair tech deals. Clear scope. No surprises.

## Tech Stack
- React 19 + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth + Database + Storage)
- Lucide React + Framer Motion
- React Router

## Design
- **Default**: Light mode
- Fonts: Orbitron (headings) + Exo 2 (body)
- Brand color: Purple `#A32BE0` (light) / `#9900FF` (dark)

## Getting Started

1. Copy `.env.example` to `.env` and add your Supabase keys
2. `npm install`
3. `npm run dev`

## Main Routes
- `/` — Landing page
- `/request` — Intake form (text + voice)
- `/quote-audit` — Free quote audit
- `/vendor` — Vendor portal (opportunities)

## Database
Use the full production schema provided earlier (UUIDv7 + RLS + GIN indexes).

## Brand
REVWA
