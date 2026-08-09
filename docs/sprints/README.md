# Folium — Sprint Roadmap

This is the single source of truth for build order. Work sprints top to bottom — each
one builds on the infrastructure/schema from the one before it. Update the status
table as sprints complete.

**Stack reference:** Next.js 15 (App Router) + TypeScript, Tailwind + shadcn/ui +
Framer Motion, PostgreSQL + Drizzle ORM, Auth.js (RBAC), Meilisearch, Cloudflare R2,
Stripe, Resend. Single app, deployed on Coolify as 3 services (app + Postgres +
Meilisearch).

## Status

| # | Sprint | Owner | Status |
|---|---|---|---|
| 0 | [Foundation](./00-foundation.md) | Claude | Done |
| 1 | [Auth & RBAC](./01-auth-rbac.md) | Claude | Done |
| 2 | [Catalog & Storefront](./02-catalog-storefront.md) | Codex | Done |
| 3 | [Cart & Checkout](./03-cart-checkout.md) | Codex | Reviewed — Stripe test-mode purchase pending |
| 4 | [Admin Back Office](./04-admin-backoffice.md) | Codex | Reviewed — live-verified |
| 5 | [Editorial & UX Polish](./05-editorial-ux-polish.md) | Codex | Reviewed |
| 6 | [Dashboard & Reporting](./06-dashboard-reporting.md) | Codex | Reviewed — Stripe test-mode promo pending |
| 7 | [Deployment & Launch](./07-deployment-launch.md) | Claude | In progress — live at https://qt87mhkyh9neewdlv1lpszek.31.220.84.245.sslip.io, blocked on Stripe/Resend/R2/Sentry keys |

Mark a row `In progress` when started and `Done` when its Definition of Done is met.

## Working agreement

- **Standards:** all agents follow [`AGENTS.md`](../../AGENTS.md) at the repo
  root (project structure, DB/UI/backend conventions, git workflow).
- **Claude's sprints (0, 1, 7):** foundation, auth/RBAC, and deployment/launch
  — chosen because they set conventions everything else depends on, or touch
  production secrets and server config directly.
- **Codex's sprints (2–6):** feature work built on the conventions Sprint 0/1
  establish. Each opens as a PR into `main`; Claude reviews before merge.
- **Definition of Done is not just local:** every sprint's DoD must also pass
  a live check on the Coolify-deployed instance on Contabo, per
  [`../DEPLOYMENT.md`](../DEPLOYMENT.md), before the row above is marked
  `Done`. No GitHub Actions minutes are used anywhere in this pipeline.
