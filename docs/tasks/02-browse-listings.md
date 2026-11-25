# 02 — Browse and filter listings

## Goal
Let a seeker scan room/flat listings on a mobile-first page and narrow them by location, price, and room type. Standalone with seeded listings; the detail page is task 03.

## User Flow
1. Open the listing list.
2. See cards with a photo, title, location, price, and room type.
3. Apply location/price/room-type filters; results update.
4. Open a card to reach the detail page (task 03); handle loading, empty, and error states.

## Database tables and columns used
Source: [supabase/schema.sql](../../supabase/schema.sql)
- `public.listings` — SELECT rows plus the location, price, and room-type fields used by filters.
- `public.listing_photos` — SELECT a photo for each card.
- Columns: **not defined yet** in `supabase/schema.sql` (only RLS/grants today). Confirm exact filter/display column names from DDL before writing queries.
