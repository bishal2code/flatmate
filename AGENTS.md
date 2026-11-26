<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# RoomFinder
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
# Post chooser popup ("+ Post" button)

## Goal
When the user taps the "+ Post" button in the header, a popup opens asking what they want to post. Choosing an option closes the popup and opens the matching form page. It must work on every page that shows the header. Standalone: no database, no dependency on other slices except that the two target pages exist (or show a temporary placeholder until they do).

## Source of truth
Design reference: the Google AI Studio screenshot of the "What would you like to post?" popup (save in docs/ as design-reference-post-chooser.png).

## User Flow
1. User taps "+ Post" in the header (desktop and mobile).
2. A centered popup (Dialog) opens over a dimmed, blurred page.
3. User sees a title, a short description, and two option cards.
4. User taps "Post a listing" and goes to /listings/new, or taps "Post a flatmate requirement" and goes to /flatmates/new. The popup closes.
5. User can close the popup without choosing: X button, Escape key, or a click on the dimmed background. The user stays on the current page.

## UI content (use exactly this text)
- Title: What would you like to post?
- Description: Choose whether to list an available room/flat or post your flatmate preferences.
- Option 1 title: Post a listing
- Option 1 text: For owners or existing tenants with an available room or flat.
- Option 1 icon: house (lucide `Home`), on a soft accent-tinted square.
- Option 2 title: Post a flatmate requirement
- Option 2 text: Share your budget, lifestyle preferences, and preferred area.
- Option 2 icon: person with plus (lucide `UserPlus`), on a soft accent-tinted square.
- Close button: X icon at the top right, with an accessible label "Close".

## Components and structure
- Use the shadcn/ui Dialog (install with `npx shadcn@latest add dialog` if missing). Do not hand-build the popup.
- Each option is a full-width, clickable card-style button or link with icon, title, and text. Rounded corners, a border, and a hover/focus state.
- Create `src/components/post-chooser.tsx` as a Client Component ("use client"), because it holds open/closed state. Keep it small and reusable.
- The header "+ Post" button owns the open state and renders the chooser. Do not copy the popup into individual pages.
- Navigation: use `next/link` or `useRouter().push` and close the popup on selection.
- Tailwind utility classes only. No custom CSS or inline styles. Theme tokens, not hardcoded colors. Icons from lucide-react.

## Database tables and columns used
None. No Supabase calls. No auth.

## Routes
- /listings/new (task 01: post a listing)
- /flatmates/new (task 04: post a flatmate requirement)
Until those pages exist, each route may show a simple placeholder page so the links don't 404.

## Acceptance criteria
- [ ] Tapping "+ Post" opens the popup on every page, on mobile (360px) and desktop.
- [ ] The popup shows the exact title, description, and both options as listed above.
- [ ] Tapping option 1 navigates to /listings/new, and option 2 to /flatmates/new. The popup closes after navigation.
- [ ] X button, Escape, and a click outside all close the popup without navigating.
- [ ] Keyboard works: Tab reaches both options and the close button, Enter selects, and focus returns to the "+ Post" button when the popup closes.
- [ ] Focus stays inside the popup while it is open.
- [ ] The popup has an accessible title and description (Dialog title and description components), and the close button has a label.
- [ ] No horizontal scroll, and the popup fits a 360px screen without cutting off text.
- [ ] `npm run build` passes with no errors.

## Out of scope
- Any form fields, saving, or database work.
- Login or user accounts.
- Animations beyond the default Dialog transition.

## Tests (Vitest)
No pure business logic here, so a unit test is optional. If a small helper is added (for example a function mapping an option id to its route), test that mapping.