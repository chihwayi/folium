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
- [ ] Multi-stage Dockerfile (small final image)
- [ ] Configure Coolify app: domain, env vars, SSL cert
- [ ] Set up automated Postgres backups (Coolify or cron + pg_dump to R2)
- [ ] Switch Stripe/Resend/R2 credentials to live keys
- [ ] Add error monitoring (e.g. Sentry free tier) and simple uptime check
- [ ] Check container memory usage under load, adjust resource limits if needed
- [ ] Write privacy policy, terms of service, returns policy pages
- [ ] Full manual QA pass: browse → search → cart → checkout → admin fulfillment

## Definition of Done
Folium is live on its production domain, a real (or live-mode test) purchase
completes successfully, and resource usage on the server is confirmed stable
alongside the other 4 apps.
