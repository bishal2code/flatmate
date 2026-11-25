# 04 — Post a flatmate requirement

## Goal
Let a user publish what they want in a flatmate and include a way to be contacted. Standalone: no dependency on listing tasks.

## User Flow
1. Open the flatmate-requirement form.
2. Enter occupation type (student/working professional), smoking and drinking preferences, maximum occupants, budget, and contact details.
3. Submit and see a confirmation that the requirement is published.

## Database tables and columns used
Source: [supabase/schema.sql](../../supabase/schema.sql)
- `public.flatmate_requirements` — INSERT one row per requirement.
- Columns: **not defined yet** in `supabase/schema.sql` (only RLS/grants today). PRD M3 lists the preference fields above; map them to real columns after DDL is added.
- No auth/user table: contact details are entered on the form.
