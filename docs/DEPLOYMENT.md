# Deployment & Live-Testing Workflow

Folium deploys to a self-hosted Coolify instance on a Contabo VPS (12GB RAM,
already running 4 other apps). GitHub Actions minutes are limited on this
account, so **no GitHub-hosted CI/CD is used** — Coolify does the building and
deploying itself, on the user's own hardware, for free.

## No GitHub Actions

- This repo intentionally has no `.github/workflows`.
- Coolify connects to the GitHub repo directly (via a webhook or its own
  polling) and builds/deploys on its own server when `main` updates. That
  webhook call is free — it's not a hosted Actions runner, so it doesn't
  consume Actions minutes.
- The "CI" substitute is local: `pnpm typecheck && pnpm lint && pnpm build`
  must pass before a branch is opened as a PR or merged. Coolify's own build
  step is the final gate (if the Docker build fails, the deploy fails).

## Auto-deploy setup (done once, in Sprint 0/7)

1. In Coolify, create an Application resource pointed at
   `github.com/chihwayi/folium`, branch `main`.
2. Enable "auto deploy on push" so every merge to `main` triggers a build,
   no manual step required.
3. Set real env vars (`DATABASE_URL`, Stripe/Resend/R2 keys, etc.) directly
   in the Coolify service's environment tab — sourced from
   `server-properties.txt` / the user's password manager, never from the
   repo.
4. Postgres and Meilisearch are separate Coolify services; the app connects
   to them over the internal network.

## Per-feature live-testing loop

Every sprint task and `Definition of Done` line item must be verified this
way before it's checked off — passing locally or in a PR review is not
sufficient on its own:

1. Merge the feature branch into `main` (after review).
2. Wait for the Coolify deploy to go green (dashboard at
   `http://31.220.84.245:8000`).
3. Exercise the feature against the live deployed URL/IP as a real user or
   admin would — not just `localhost`. E.g. for a checkout change, run an
   actual Stripe test-mode purchase against the live site, not just the dev
   server.
4. Record the result (pass/fail, what was checked) in the PR or the sprint
   doc.
5. If the live check fails, use Coolify's rollback to the previous deploy
   rather than leaving a broken version live while debugging.

## Secrets handling

- `server-properties.txt` (SSH + Coolify admin credentials) and `.env` files
  are gitignored and must stay that way. No agent should print their full
  contents into chat/PR output beyond what's strictly needed for the
  immediate step.
- Live (non-test) Stripe/Resend/R2 keys only get set in Sprint 7, directly in
  Coolify's env config — see [`07-deployment-launch.md`](./sprints/07-deployment-launch.md).
