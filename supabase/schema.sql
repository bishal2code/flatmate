alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;
alter table public.flatmate_requirements enable row level security;

grant usage on schema public to anon;
grant select, insert, update, delete on public.listings to anon;
grant select, insert, update, delete on public.listing_photos to anon;
grant select, insert, update, delete on public.flatmate_requirements to anon;

create policy "anon full access" on public.listings
  for all to anon using (true) with check (true);

create policy "anon full access" on public.listing_photos
  for all to anon using (true) with check (true);

create policy "anon full access" on public.flatmate_requirements
  for all to anon using (true) with check (true);