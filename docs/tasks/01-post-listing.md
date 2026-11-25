# 01 — Post a room or flat listing

## Goal
Let an owner or tenant publish a room/flat listing with photos and contact details, then confirm the listing was saved. Standalone: demo it with seeded rows if later slices aren't built.

## User Flow
1. Open the new-listing form.
2. Enter title, location, price, room type, description, and contact details; attach photos.
3. Submit: create the `listings` row and its `listing_photos` rows.
4. See a success state with a link to the detail page (task 03).

## Database tables and columns used
Source: [supabase/schema.sql](../../supabase/schema.sql)
- `public.listings` — INSERT one row per listing.
- `public.listing_photos` — INSERT one row per uploaded photo.
- Columns: **not defined yet** in `supabase/schema.sql` (it currently contains only RLS/grants). PRD M1/M2 imply title, location, price, room type, description, contact, and a photo/listing link; map these to real columns only after DDL is added.
- No auth/user table: per `AGENTS.md`, this is a single-user demo.
