# Starting Codex on this repo

Codex CLI auto-reads `AGENTS.md` at the repo root, so once that's in place you
mostly just need to point it at which sprint to build and tell it the ground
rules are already written down. Suggested first prompt, once Sprint 0 is
merged to `main`:

```
Read AGENTS.md and docs/sprints/README.md first, then docs/sprints/02-catalog-storefront.md.
You own Sprint 2 (Catalog & Storefront). Follow every convention in AGENTS.md —
project structure, Drizzle/DB naming, Server Actions over route handlers, zod
validation at boundaries, Tailwind + shadcn/ui only, no ad hoc CSS.

Work on a branch named sprint-2-catalog, not directly on main. Open a PR when
the sprint's tasks and Definition of Done (in the sprint doc) are met locally.
Do not touch server-properties.txt, .env, or any live Coolify config — those
are handled outside Codex. Do not add GitHub Actions workflows.

Ask me before making schema changes outside what Sprint 0 already established,
since Sprint 3 (cart/orders) and Sprint 4 (admin) build on the same tables.
```

Swap the sprint number/branch name for whichever sprint you're kicking off
(Codex owns 2 through 6 — see the ownership table in
[`sprints/README.md`](./sprints/README.md)). Each sprint should only start
once the one before it is actually merged and live-verified, since the schema
and conventions compound sprint over sprint.

After Codex opens a PR, tell Claude to review it — it'll check the diff
against `AGENTS.md` and the sprint's Definition of Done, then run the live
Coolify check from [`DEPLOYMENT.md`](./DEPLOYMENT.md) before the sprint row
in `sprints/README.md` gets marked `Done`.
