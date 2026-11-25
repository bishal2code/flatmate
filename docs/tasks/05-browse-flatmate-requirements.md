# 05 — Browse flatmate requirements and contact

## Goal
Let a seeker scan posted flatmate requirements and contact a potential flatmate from the listing. Standalone with seeded requirements.

## User Flow
1. Open the flatmate-requirements list.
2. Scan cards showing occupation type, smoking/drinking preferences, max occupants, and budget.
3. Open a requirement to see the full details and contact details.
4. Tap the contact link to reach the person outside the app.

## Database tables and columns used
Source: [supabase/schema.sql](../../supabase/schema.sql)
- `public.flatmate_requirements` — SELECT list rows and a single row by id, including contact field(s).
- Columns: **not defined yet** in `supabase/schema.sql` (only RLS/grants today); preference and contact column names need DDL.
- No AI matching or in-app chat: PRD §7.2 keeps both out of MVP.
