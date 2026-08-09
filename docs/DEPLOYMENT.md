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

## Auto-deploy setup (already done — reference)

1. In Coolify, an Application resource is pointed at
   `github.com/chihwayi/folium`, branch `main`.
2. "Auto deploy on push" is enabled via a GitHub webhook, so every merge to
   `main` triggers a build with no manual step required.
3. Real env vars (`DATABASE_URL`, Stripe/Resend/R2 keys, etc.) are set
   directly in the Coolify app's environment tab — sourced from
   `deployment-credentials.txt` / `server-properties.txt` / the owner's
   password manager, never from the repo.
4. Postgres and Meilisearch are separate Coolify services; the app connects
   to them over the internal network.

## Per-feature live-testing loop

Every feature and its `Definition of Done` must be verified this way before
it's considered complete — passing locally or in a PR review is not
sufficient on its own:

1. Merge the feature branch into `main` (after review).
2. Wait for the Coolify deploy to go green (dashboard at
   `http://31.220.84.245:8000`).
3. Exercise the feature against the live deployed URL as a real user or
   admin would — not just `localhost`. E.g. for a checkout change, run an
   actual Stripe test-mode purchase against the live site, not just the dev
   server.
4. Record the result (pass/fail, what was checked) in the PR or commit
   message.
5. If the live check fails, use Coolify's rollback to the previous deploy
   rather than leaving a broken version live while debugging.

## Secrets handling

- `server-properties.txt` (SSH + Coolify admin credentials),
  `deployment-credentials.txt` (production app credentials), and `.env`
  files are gitignored and must stay that way. No agent should print their
  full contents into chat/PR output beyond what's strictly needed for the
  immediate step.
