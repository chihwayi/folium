# Sprint 7 — Deployment & Launch

## Goal
Ship it, safely, on the Contabo/Coolify box alongside the existing 4 apps.

## Deliverables
- Production Dockerfile for the Next.js app
- Coolify deployment configured (env vars, domain, SSL)
- Postgres backups scheduled
- R2, Stripe, and Resend running in live (non-test) mode
- Basic uptime/error monitoring
- Load/resource sanity check (confirm RAM footprint alongside the other 4 apps)
- Legal/basic pages: privacy policy, terms, returns/refund policy
- Launch checklist run through end-to-end on production

## Tasks
- [x] Multi-stage Dockerfile (small final image) — `Dockerfile`, `output: "standalone"`, ~320MB image, verified locally before touching the server
- [x] Configure Coolify app: domain, env vars, SSL cert — new isolated Coolify Application resource (uuid `qt87mhkyh9neewdlv1lpszek`), auto-generated sslip.io domain with Let's Encrypt SSL via Traefik, HTTP→HTTPS redirect confirmed, GitHub webhook wired for auto-deploy on push to `main`
- [x] Set up automated Postgres backups — daily local `pg_dump`, 3am UTC, 7-day retention, verified with a real manual run (real dump file produced)
- [ ] Switch Stripe/Resend/R2 credentials to live keys — **blocked**: no Stripe/Resend/R2 credentials (test or live) available yet. Env vars are wired and ready; add real values in Coolify's dashboard for that resource, no redeploy needed
- [ ] Add error monitoring (e.g. Sentry free tier) and simple uptime check — **blocked**: no Sentry account/DSN yet
- [x] Check container memory usage under load, adjust resource limits if needed — ~86MB RAM, negligible CPU; whole box (17 containers incl. Folium) at ~1.3GB / 11.68GB, plenty of headroom
- [x] Write privacy policy, terms of service, returns policy pages — `/privacy`, `/terms`, `/returns`, linked from the storefront footer. Draft content, not a substitute for real legal review
- [x] Full manual QA pass: browse → search → cart → checkout → admin fulfillment — verified live against production: catalog/search/404s, add-to-cart + drawer, checkout page reachable, owner login, all `/admin/*` routes. Checkout itself can't complete without Stripe keys (see blocker above)

## Owner account
Seeded on production: `ignatiouschihwayi@gmail.com`. Password was generated
and shown once in chat at creation time — change it via Account settings if
it hasn't been rotated already.

## Definition of Done
Folium is live on its production domain (https://qt87mhkyh9neewdlv1lpszek.31.220.84.245.sslip.io)
over HTTPS, with the catalog, search, auth/RBAC, cart, and admin back office
verified working. **Not yet fully done**: a real/live-mode-test purchase
can't complete until Stripe keys are added — that's the one remaining item
before this sprint's DoD is fully met.
