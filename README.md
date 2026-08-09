# Folium

An independent online bookstore — catalog, search, cart and checkout,
customer accounts, reviews and wishlists, and a staff/owner back office for
running the store.

Live at **https://qt87mhkyh9neewdlv1lpszek.31.220.84.245.sslip.io**

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS + shadcn/ui + Framer Motion
- PostgreSQL + [Drizzle ORM](https://orm.drizzle.team)
- [Auth.js](https://authjs.dev) for authentication and role-based access
  (`customer` / `staff` / `owner`)
- [Meilisearch](https://www.meilisearch.com) for catalog search
- [Stripe](https://stripe.com) for checkout
- [Resend](https://resend.com) for transactional email
- Cloudflare R2 for book cover storage
- Deployed on a self-hosted [Coolify](https://coolify.io) instance

## Features

- Public catalog with search, filtering, and sorting
- Cart and Stripe checkout, with promo codes
- Customer accounts: order history, wishlist, reviews
- Staff/owner admin: catalog and inventory management, CSV import, order
  fulfillment, promotions, homepage collections, review moderation, staff
  invitations, and a sales/reporting dashboard

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in real values, see below
pnpm dev
```

The app expects a running PostgreSQL database and Meilisearch instance —
see `.env.example` for the full list of required environment variables.

### Database

```bash
pnpm db:generate   # generate a migration after changing db/schema/*.ts
pnpm db:migrate    # apply migrations
pnpm db:seed       # seed sample catalog data
pnpm db:seed-owner # create/promote an owner account:
                    #   OWNER_EMAIL=you@example.com OWNER_PASSWORD=... pnpm db:seed-owner
```

Schema changes always go through `drizzle-kit generate` — migrations are
committed, never hand-edited or applied ad hoc against a real database.

### Other scripts

```bash
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint
pnpm build       # production build
```

## Project structure

- `app/(storefront)/...` — public customer-facing routes
- `app/(admin)/admin/...` — staff/owner back office, gated by role
- `app/api/...` — route handlers for webhooks and search
- `db/schema/*.ts` — one file per domain area, barrel-exported from
  `db/schema/index.ts`
- `db/migrations/` — Drizzle-generated, never hand-edited
- `lib/` — framework-agnostic helpers (auth, cart, catalog, orders,
  payments, promotions, email)
- `components/ui/` — shadcn primitives
- `components/` — shared composed components

See [`AGENTS.md`](./AGENTS.md) for the full set of conventions (validation,
auth patterns, git workflow, etc.) followed throughout the codebase.

## Deployment

Deploys to a self-hosted Coolify instance — no GitHub-hosted CI/CD. See
[`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for the full workflow,
including the live-testing requirement before any feature is considered
done.
