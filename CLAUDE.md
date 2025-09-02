# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development
npm run dev              # Start development server with Next.js

# Build & Production
npm run build           # Build for production (includes pre-build guard check)
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run check:no-client # Verify no "use client" directives exist
```

## Project Overview

* **Stack:** Next.js 15.5 (App Router), React 19, TypeScript, Tailwind CSS v4, Turbopack.
* **Goal:** SEO-focused **pottery classes directory** with server-first rendering and crawlable state.

## Non-Negotiables

* **Server Components by default.** No `"use client"` unless strictly needed for interactivity.
* **No client-only fetching for primary content.** Core listings must render HTML on first response.
* **SSR enforced for dynamic routes.** Use `export const dynamic = 'force-dynamic'` (or `revalidate = 0`).
* **One `<h1>` per page**; ≥250 words of unique, city-specific copy where possible.
* **URL-driven filters & pagination.** All filters live in query params and render on the server.
* **Canonical metadata on server** (`title`, `description`, `canonical`), plus `robots`, Open Graph, and JSON-LD.

## Tasks Workflow

1. **Read** relevant code and data flow; draft a plan in `tasks/todo.md` as checkboxes.
2. **Check in with me** before coding by showing the plan.
3. **Implement** in small steps, marking off `tasks/todo.md`.
4. **Report back** with a short explanation of what changed and why.

## Server/Client Boundary

* High-level route/page/layout components **must** be server components.
* Push `"use client"` only to the smallest leaf components that truly need interactivity.
* Prefer **Server Actions** for form submissions.
* Do **not** use `useEffect` for data fetching — always fetch on the server.

### Example: Zip Search (server-first)

* `app/(marketing)/page.tsx`: Server component renders `<form action={searchByZipAction}>`.
* `app/actions/searchByZip.ts`: Server Action validates input, does the query, redirects to results URL with params.
* `app/pottery-classes/[city]/page.tsx`: Reads URL params, fetches listings on the server, renders HTML.

## Database Architecture

* **Supabase** as database provider with PostgreSQL
* Main table: `providers_raw` containing pottery studio listings
* Three Supabase client configurations in `lib/db.ts`:
  - `supabaseServer()`: For authenticated server components
  - `supabaseServiceRole()`: For admin operations (requires SERVICE_ROLE_KEY)
  - `supabaseStatic()`: For SSG/ISR pages without auth
* Query helpers in `lib/queries.ts` handle slug-based lookups and filtering
* Database types generated in `lib/database.types.ts`

## Route Structure

```
/                                       (Landing + global search)
/pottery-classes/                       (National directory)
/pottery-classes/state/[state]/         (State listings)
/pottery-classes/zip/[zip]/             (ZIP code listings)
/pottery-classes/[state]/[city]/        (City listings)
/pottery-classes/[state]/[city]/[studio]/ (Studio detail page)
/search                                 (Search results)
/api/search/by-zip                      (ZIP search API)
/api/debug-states                       (Debug endpoint)
```

## SEO Requirements (per page type)

* **Listing pages**:

  * H1 with geo + intent (“Pottery Classes in Miami, FL”).
  * 250–600 words unique intro copy.
  * `ItemList` JSON-LD of visible listings (first page).
  * Paginated with `?page=` and `rel="next/prev"`.

* **Detail pages**:

  * `LocalBusiness` JSON-LD (name, address, phone, geo, URL).
  * Unique description (convert structured fields into prose).
  * Internal links back to city/state; “similar studios nearby”.

* **Global**:

  * `BreadcrumbList` JSON-LD.
  * `robots.ts` with sensible defaults.
  * `sitemap.ts` that emits all location + detail URLs.

## Metadata Helpers

Create `lib/seo.ts`:

* `buildTitle({ type, city, state, page })`
* `buildDescription({ type, city, state, count })`
* `canonicalFor({ pathname, searchParams })`
* `jsonLd.*` (ItemList, LocalBusiness, BreadcrumbList)

Use those in **server** page files via `export const metadata`.

## Data Access & Performance

* Centralize data fetching in `lib/data/*` with typed queries.
* Select minimal columns for listing pages; full record only on detail pages.
* Always paginate.
* Add DB indexes for common filters: `(state)`, `(state, city)`, `(city, name)`, `(slug)`.
* Use `AbortController` with RSC `fetch`.

## Filters & URLs

* Filters must be **URL-first**: `?page=2&sort=rating&price=max50&time=evening`.
* Never store filter state only in React state.
* Server reads params → runs query → renders hydrated HTML.

## Key Utility Functions

* `lib/slugify.ts`: Handles slug generation for URLs (city, state, provider names)
* `lib/formatHours.ts`: Formats working hours for display
* `lib/mdx.tsx`: MDX processing for content pages

## Files to Add (or keep updated)

* `app/robots.ts` (TODO)
* `app/sitemap.ts` (EXISTS - generates sitemaps for pottery classes)
* `app/not-found.tsx` (TODO)
* `middleware.ts` for URL normalization (TODO)
* `lib/seo.ts` for titles/descriptions/canonicals/JSON-LD (TODO)
* `lib/validations.ts` for zod/valibot schemas (TODO)
* `app/actions/*.ts` for server actions (TODO)
* `components/client/*` for the few client components (TODO)

## Environment Variables Required

```bash
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY=       # Service role key (for admin operations)
```

## Quality Gates

* **Guard script** (`scripts/guard-no-use-client.ts`) fails build if `"use client"` exists anywhere in codebase
* `npm run lint` + `npx tsc --noEmit` must pass
* Add a quick Lighthouse/Playwright smoke test:

  * SSR HTML contains listing names (no empty shells).
  * Exactly one `<h1>`.
  * Canonical present.

## Styling

* Tailwind v4 based.
* Palette: pottery-inspired (clays, ivories, teals).
* Accessible contrast and visible focus states.

## Definition of Done

* Server-rendered HTML contains real data.
* No unintended `"use client"` in server layers.
* Metadata + JSON-LD valid.
* Links between city/state/detail pages present.
* Tests & type checks pass.

---