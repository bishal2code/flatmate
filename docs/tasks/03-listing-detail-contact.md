# 03 — Listing detail and owner contact

## Goal
Let a seeker open one listing and contact its owner using the details shown on the page. Standalone with a seeded listing and photos.

## User Flow
1. Open a listing card (from task 02 or direct URL).
2. View photo gallery, location, price, room type, description, and contact details.
3. Tap the contact link or copy the contact detail to reach the owner outside the app.

## Database tables and columns used
Source: [supabase/schema.sql](../../supabase/schema.sql)
- `public.listings` — SELECT a single row by id, including its contact field(s).
- `public.listing_photos` — SELECT photos for that listing.
- Columns: **not defined yet** in `supabase/schema.sql` (only RLS/grants today); id and contact column names must come from DDL.
- No in-app chat: PRD M4 means showing contact info only.
