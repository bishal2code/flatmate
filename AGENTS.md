<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# Flatmate
Rooms, flats and flatmates finder for Pokhara, Nepal. Student project, built in one day by 4 people.

## Stack
Next.js (App Router) + Tailwind + Supabase (database and Storage). No separate backend, no auth.

## Tables
listings(id, created_at, title, description, listing_type, location, price_npr, contact_name, contact_phone, contact_email)
listing_photos(id, listing_id, image_url, sort_order)
flatmate_requirements(id, created_at, title, description, location, budget_npr, occupation_type, smoking_allowed, drinking_allowed, max_occupants, contact_name, contact_phone, contact_email)
Never rename or add columns without asking.

## Scope (PRD MVP only)
Pages: Home, Listings, Listing detail, Post listing, Flatmate requirements, Post requirement.
Do NOT add: login/signup, chat, map search, booked flag, payments, AI matching, reviews, favourites.

## Rules
- Mobile-first, Tailwind only. Use shared components in components/ui/.
- Edit only the files for my assigned page. Do not touch shared files (layout, components/ui, lib/supabase, package.json, .env) without asking.
- Read Supabase keys from env variables. Never commit .env.
- Keep code simple and readable. No new npm packages without asking.
- Work on my own feature branch, never on main.

## My task
(Each person fills in: e.g. "Person 2: Listings page and listing cards/filters")
