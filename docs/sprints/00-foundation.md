# Sprint 0 — Foundation

## Goal
Stand up the skeleton: repo, tooling, database schema, and Coolify services, so every
later sprint has infrastructure to build on.

## Deliverables
- Next.js 15 + TypeScript app scaffolded (`app/` router)
- Tailwind CSS + shadcn/ui installed and themed (base premium color/typography system)
- PostgreSQL provisioned on Coolify; Drizzle ORM connected
- Initial Drizzle schema: `users`, `books`, `categories`, `inventory`, `orders`,
  `order_items`
- Meilisearch service provisioned on Coolify (empty index for now)
- Git repo initialized, `.gitignore` verified, first commit pushed
- Basic CI: typecheck + lint on push (GitHub Actions or Coolify build step)

## Tasks
- [ ] `create-next-app` with TypeScript, App Router, Tailwind
- [ ] Install & configure shadcn/ui, set base design tokens (font, colors, radius)
- [ ] Set up Drizzle config + migrations folder
- [ ] Write schema for core tables, generate first migration
- [ ] Provision Postgres service in Coolify, connect via `DATABASE_URL`
- [ ] Provision Meilisearch service in Coolify
- [ ] `.env.example` documenting all required env vars
- [ ] Initialize git, confirm `server-properties.txt` and `.env` are ignored
- [ ] Push repo to remote (GitHub/private)
- [ ] Add lint/typecheck CI step

## Definition of Done
`pnpm dev` runs a blank but styled homepage locally, the DB migration applies
cleanly against the Coolify Postgres instance, and Meilisearch is reachable.
