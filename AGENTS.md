# Folium — Agent Standards

This file is the shared contract for every coding agent working in this repo
(Codex, Claude, or anyone else). Read it before writing code. The sprint plan
lives in [`docs/sprints/README.md`](./docs/sprints/README.md) — that's *what*
to build, this file is *how*.

## Stack
Next.js 15 (App Router) + TypeScript, Tailwind + shadcn/ui + Framer Motion,
PostgreSQL + Drizzle ORM, Auth.js (RBAC), Meilisearch, Cloudflare R2, Stripe,
Resend. Single app, deployed on Coolify (self-hosted, Contabo VPS) as 3
services: app + Postgres + Meilisearch.

## Sprint ownership

| # | Sprint | Owner | Why |
|---|---|---|---|
| 0 | Foundation | Claude | Sets the schema/project conventions everything else follows |
| 1 | Auth & RBAC | Claude | Security-critical; every later sprint gates on its role model |
| 2 | Catalog & Storefront | Codex | Feature build on established patterns |
| 3 | Cart & Checkout | Codex | Feature build on established patterns |
| 4 | Admin Back Office | Codex | Feature build on established patterns |
| 5 | Editorial & UX Polish | Codex | Feature build on established patterns |
| 6 | Dashboard & Reporting | Codex | Feature build on established patterns |
| 7 | Deployment & Launch | Claude | Touches production secrets, live payment keys, server config |

Claude reviews every Codex PR before merge (correctness, security, adherence
to this file) — see `.claude/` skills `code-review` / `security-review`.
Codex should open a PR rather than pushing straight to `main`.

## Non-negotiables

- Never read, print, or commit `server-properties.txt`, `.env`, or `.env.*`
  (all gitignored — keep it that way). Add new required vars to `.env.example`
  only, with a placeholder value.
- Never force-push, never rewrite history on `main`.
- Never mark a sprint task done, or a `Definition of Done` item met, without
  the live check described in [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).
- No GitHub Actions minutes. This repo has no `.github/workflows` and should
  stay that way — see Deployment below for why.

## Project structure

- `app/(storefront)/...` — public customer-facing routes
- `app/(admin)/admin/...` — staff/owner back office, gated by role middleware
- `app/api/...` — route handlers only for things that must be a real HTTP
  endpoint (Stripe/Resend webhooks, Meilisearch sync). Prefer Server Actions
  for everything else.
- `db/schema/*.ts` — one file per domain area (`users.ts`, `catalog.ts`,
  `orders.ts`, ...), barrel-exported from `db/schema/index.ts`
- `db/migrations/` — Drizzle-generated, never hand-edited
- `lib/` — framework-agnostic helpers (validation schemas, auth helpers,
  Meilisearch client, Stripe client, email templates)
- `components/ui/` — shadcn primitives, unmodified apart from theme tokens
- `components/` — shared composed components; feature-specific components
  live next to the route that owns them (`app/.../_components/`)

## TypeScript & validation

- Strict mode on, no `any` without a comment explaining why it's unavoidable.
- Validate every external input (form submissions, webhook payloads, search
  params) with `zod` at the boundary — Server Action or route handler, not
  buried in a component.
- Prefer Server Actions co-located with the route that uses them; only reach
  for a client-side fetch when a Server Action genuinely can't do the job.

## Database (Drizzle)

- Table names: plural, `snake_case` (`order_items`, not `orderItem`).
- Every table gets `id` (uuid, default `gen_random_uuid()`), `created_at`,
  `updated_at`.
- Foreign keys are explicit and indexed; no orphaned rows by design (use
  `onDelete: 'restrict'` unless a cascade is clearly correct).
- Schema changes always go through `drizzle-kit generate` — commit the
  generated migration, don't apply schema changes by hand against prod.
- Money is integer cents, never float.

## UI/UX

- Tailwind + shadcn/ui only — no ad hoc CSS files, no competing component
  libraries.
- Design tokens (color, type scale, radius) are set once in Sprint 0; reuse
  them, don't invent new colors/spacing per component.
- The bar is "premium bookstore," not "generic admin template" — see Sprint 5
  for the editorial polish pass, but every component built earlier should
  still take loading/empty/error states seriously the first time, not as a
  later patch.
- Framer Motion for intentional motion (page transitions, add-to-cart,
  hover), not decoration for its own sake.

## Auth & RBAC (once Sprint 1 lands)

- Roles: `customer`, `staff`, `owner`. Never trust a client-supplied role —
  always re-check from the session/DB on the server.
- `(admin)` routes are gated by middleware, but individual Server
  Actions/route handlers under `/admin` must also re-check role server-side
  (defense in depth — don't rely on middleware alone).

## Git workflow

- Branch per sprint/feature: `sprint-2-catalog`, `sprint-3-checkout`, etc.
- Commit messages: imperative, explain why over what.
- Open a PR into `main`; Claude reviews before merge.
- `main` is always deployable — see Deployment.

## Environment variables

- Every new env var: add to `.env.example` with a placeholder, document what
  it's for in a one-line comment.
- Real values only ever live in `.env` locally (gitignored) or in the Coolify
  service's environment config in the dashboard — never in the repo, never
  in chat/PR output.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
