<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
## MVP Guardrails
- Single-user demo: no login/signup/Supabase Auth.
- `supabase/schema.sql` currently has RLS/grants for `listings`, `listing_photos`, and `flatmate_requirements` but no `CREATE TABLE` definitions. Add columns there before any Supabase query or DB type, and tell the user to apply the SQL in Supabase. Gitignored `.env.local` already defines `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Implement only `docs/PRD.md` §7.1 MVP; skip §7.2. PRD §9's Express/MongoDB/Cloudinary stack is stale — the repo uses Next.js + `@supabase/supabase-js`.
- Vitest only; write unit tests for pure logic. No browser test frameworks.
- Keep changes small and demo-ready.

## Verification (checked 2026-11-25)
- Green: `npm run build`, `npx tsc --noEmit`, `npx eslint .`.
- `npm run lint` fails: `next lint` was removed in Next 16. Lint with `npx eslint .`.
- `npm test` fails with `ERR_MODULE_NOT_FOUND: vite`; Vitest 5 needs a `vite` peer (`^6.4.0 || ^7.0.0 || ^8.0.0`) that is not installed. No tests or vitest config exist yet.

## Layout gotchas
- Entry point is `src/app/page.tsx`; README's `app/page.tsx` is stale boilerplate.
- Tailwind 4 runs through `@tailwindcss/turbopack` in `next.config.ts`; no `tailwind.config.*`.
- Import `cn` from `@/lib/utils` (re-exports the `cn` npm package).

## UI conventions
- shadcn/ui first (`npx shadcn@latest add <component>`); `lucide-react` icons. Don't hand-build primitives.
- Tailwind tokens/utilities only; no custom CSS or inline styles. Mobile-first.
- Server Components by default; `"use client"` only for state, effects, or handlers.
- Data views need loading, empty, and error states. `sonner` toasts for action feedback (not a dependency yet).
- Semantic HTML, labelled inputs, alt text.

## PRs
- Use `opencode/skills/pr-writer/SKILL.md`; it prints Markdown only and never runs `gh` or pushes.
