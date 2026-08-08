# Codex Sprints 2–6 Handoff for Claude

Codex completed all assigned feature sprints, opened a separate pull request for each sprint, ran the available validation checks, reviewed the implementation, and squash-merged every pull request into `main`.

Current `main` commit at handoff:

```text
eab6522 Add actionable sales reporting and promotions (#5)
```

## Shared implementation standards

The work follows `AGENTS.md`, `docs/CODEX_KICKOFF.md`, and the matching specifications under `docs/sprints/`:

- Next.js App Router with strict TypeScript.
- Tailwind and the established shadcn-style component conventions.
- Drizzle ORM with generated, unedited migrations.
- Zod validation at external-input boundaries.
- Server Actions for application mutations where appropriate.
- Integer cents for monetary values.
- Explicit foreign keys and indexes.
- Defense-in-depth authorization inside admin Server Actions.
- No secrets, `.env` files, production credentials, or GitHub Actions workflows were introduced.

Every merged pull request passed GitGuardian. Before each merge, Codex ran the applicable local gates:

```bash
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

## Branch and pull-request history

| Sprint | Branch | Pull request | Squash commit |
|---|---|---|---|
| 2 — Catalog & Storefront | `sprint-2-catalog` | [#1](https://github.com/chihwayi/folium/pull/1) | `80fedf7` |
| 3 — Cart & Checkout | `sprint-3-checkout` | [#2](https://github.com/chihwayi/folium/pull/2) | `a16e774` |
| 4 — Admin Back Office | `sprint-4-admin` | [#3](https://github.com/chihwayi/folium/pull/3) | `de8123b` |
| 5 — Editorial & UX Polish | `sprint-5-editorial` | [#4](https://github.com/chihwayi/folium/pull/4) | `fc689f2` |
| 6 — Dashboard & Reporting | `sprint-6-reporting` | [#5](https://github.com/chihwayi/folium/pull/5) | `eab6522` |

All five pull requests are already merged into `main`.

## Sprint 2 — Catalog & Storefront

### Delivered

- Public book catalog and book-detail pages.
- Category listing and category-specific routes.
- Search, sorting, filtering, and pagination using validated search parameters.
- Meilisearch integration.
- Catalog schema and generated migrations.
- Reusable storefront book components.
- Loading, empty, and unavailable states.

Main routes:

```text
/books
/books/[slug]
/categories
/categories/[slug]
/api/search
```

### Claude review targets

- Search parameter validation and out-of-range pagination.
- Meilisearch index configuration and synchronization.
- Stable book and category slugs.
- R2 cover-image behavior in the deployed environment.
- Catalog migration compatibility with production.

Sprint 2 has an existing live-verification record in commit `bc0b530`, which states that it was verified against Coolify PostgreSQL and Meilisearch.

## Sprint 3 — Cart & Checkout

### Delivered

- Persistent shopping cart.
- Add, update, and remove cart-item behavior.
- Inventory-aware cart validation.
- Stripe Checkout Session creation.
- Stripe webhook and checkout-completion handling.
- Idempotent order fulfillment.
- Transactional inventory deduction.
- Order and order-item persistence.
- Customer order confirmation and account order history.
- Resend-based order-confirmation support.
- Generated cart and order migration.

Main routes:

```text
/cart
/checkout
/api/checkout/complete
/api/stripe/webhook
/order-confirmation/[id]
/account/orders
```

### Important behavior

- Prices are loaded from the trusted server-side catalog.
- Book IDs are stored in server-generated Stripe product metadata.
- Fulfillment retrieves the Stripe session and requires a paid payment-mode session.
- Paid totals are reconciled against line-item prices.
- Inventory is decremented transactionally and cannot fall below the purchased quantity.
- Stripe Checkout Session IDs prevent duplicate orders.
- All money remains integer cents.

### Claude review targets

- Stripe webhook signature validation.
- Idempotency under repeated webhook and completion requests.
- Concurrent inventory deduction.
- Checkout-total reconciliation.
- Confirmation-email retry and failure behavior.
- Authenticated cart ownership after Sprint 1 integration.
- Production Stripe webhook registration.

## Sprint 4 — Admin Back Office

### Delivered

- Admin shell and navigation.
- Book and category administration.
- Inventory management.
- Order management with controlled status transitions.
- Validated CSV book import.
- Validated R2 cover upload and deletion.
- Staff invitation persistence.
- Staff and owner role-management controls.
- Server-side authorization checks for admin mutations.

Main routes:

```text
/admin
/admin/books
/admin/books/new
/admin/books/[id]
/admin/categories
/admin/inventory
/admin/orders
/admin/staff
```

### Security behavior

- Admin actions call `requireAdmin()` or `requireOwner()`.
- Mutations do not rely only on route middleware.
- Owners cannot remove their own owner access.
- Order status changes must follow the permitted transition map.
- Cover files are constrained by MIME type and size.
- R2 deletion keys must match the restricted cover-key format.
- CSV input is size-limited and each row is validated.
- Invitation tokens are cryptographically random; only token hashes are persisted.

### Sprint 1 dependency

Sprint 4 deliberately uses the shared authorization adapter. Sprint 1 must supply the final Auth.js session implementation, current-user lookup, role lookup, middleware, invitation acceptance, and invitation delivery.

Until Sprint 1 lands, authorization remains intentionally deny-by-default. Do not weaken that behavior merely to expose the admin pages.

Claude should integrate and verify:

- `requireAdmin()` and `requireOwner()`.
- Current-user/session resolution.
- Admin route middleware.
- Staff invitation acceptance and email delivery.
- Session role refresh after a role change.

## Sprint 5 — Editorial & UX Polish

### Delivered

- Admin-managed curated homepage collections.
- Collection publication and ordering.
- Ordered book assignment within collections.
- Customer reviews and admin moderation.
- Approved-review display.
- Customer wishlists.
- Paid-order-only co-purchase recommendations.
- Improved editorial homepage presentation.
- Branded loading, not-found, and empty states.
- Intentional Framer Motion page and add-to-cart interactions.
- Generated editorial schema migration.

Main routes and surfaces:

```text
/
/account/wishlist
/admin/collections
/admin/reviews
/books/[slug]
```

### Sprint 1 dependency

Authenticated review submission and wishlists depend on Sprint 1's session/current-user implementation. Claude must verify that a user cannot spoof another customer ID or mutate another customer's wishlist.

### Claude review targets

- Review ownership, authorization, moderation, and public filtering.
- Wishlist ownership.
- Recommendation-query correctness and exclusion of unpaid orders.
- Collection publication filtering and ordering.
- Empty collection behavior.
- Accessibility and reduced-motion behavior.

## Sprint 6 — Dashboard & Reporting

### Delivered

- Admin revenue dashboard.
- Paid-order volume, average-order value, and promotional-discount totals.
- Revenue-over-time visualization.
- Top-selling-book reporting.
- Low-stock reporting.
- Percentage and fixed-value promo codes.
- Promo activation, deactivation, expiry, usage limits, and usage counts.
- Promo application during Stripe Checkout.
- Exact discount reconciliation during fulfillment.
- Order-level discount persistence.
- Generated promotion and order migration.

Main routes:

```text
/admin
/admin/promotions
/checkout
```

Database additions:

```text
promo_codes
discount_type enum
orders.discount_cents
orders.promo_code_id
```

Generated migration:

```text
db/migrations/0005_sturdy_silver_centurion.sql
```

Do not hand-edit the generated migration.

### Important promo behavior

- Codes are normalized to uppercase and validated with Zod.
- Percentage discounts are constrained to 1–99 percent.
- Fixed discounts use integer cents.
- A discount cannot reduce an order to zero or less.
- Inactive, expired, or exhausted codes cannot start a new discounted checkout.
- Codes are deactivated rather than deleted, preserving order references.
- The server calculates the exact discount and creates a one-time fixed-cent Stripe coupon. Percentage codes are converted to an exact fixed-cent value for the checkout to avoid per-line rounding differences.
- The promo ID and exact discount are stored in server-generated Stripe metadata.
- Fulfillment reconciles line subtotal minus discount against Stripe's paid total.
- A paid session still fulfills if its promo expires or is deactivated after the Checkout Session was issued.
- Usage count increments during paid-order fulfillment.

### Claude review targets

- Promo concurrency and usage-limit semantics.
- Policy for cleanup of abandoned one-time Stripe coupons.
- Timezone handling of admin `datetime-local` expiry values.
- Dashboard SQL on the production PostgreSQL version.
- Treatment of cancellations and future refunds in reporting.
- Live reporting using real Stripe test-mode transactions.

## Migrations and environment

The merged work contains generated Drizzle migrations through `0005_sturdy_silver_centurion.sql`. Inspect migration order and compatibility before applying them:

```bash
pnpm db:migrate
```

No real environment values were committed. Verify the placeholder variables documented in `.env.example` for PostgreSQL, Meilisearch, Cloudflare R2, Stripe, Resend, Auth.js, and the public storefront URL. Never paste real values into chat or commit them.

## Work still owned by Claude

### Sprint 1 — Auth & RBAC

Complete and integrate:

- Auth.js configuration.
- `customer`, `staff`, and `owner` roles.
- Session-based current-user resolution.
- Admin middleware and server-side role lookup.
- Staff invitation acceptance.
- Authenticated carts, wishlists, reviews, order history, and admin access.

This is required before the authenticated flows in Sprints 3–5 and the admin surfaces in Sprints 4–6 are fully operational.

### Sprint 7 — Deployment & Launch

Complete:

- Migration application in Coolify.
- Production/test environment configuration.
- Stripe webhook registration and test-mode purchase verification.
- Resend delivery verification.
- R2 upload verification.
- Meilisearch indexing verification.
- Customer, staff, and owner RBAC smoke tests.
- Checkout/webhook idempotency tests.
- Promo, reporting, and low-stock tests using live database data.
- Backup and rollback verification.
- The checklist in `docs/DEPLOYMENT.md`.

## Definition of Done warning

Do not mark remaining Definition of Done items complete solely because lint, TypeScript, build, and GitGuardian passed. `AGENTS.md` requires the live checks described in `docs/DEPLOYMENT.md`.

At handoff:

- The code for Sprints 2–6 is merged into `main`.
- Static validation and GitGuardian are green.
- Sprint 2 has an existing live-verification record.
- Sprints 3–6 still require their applicable Coolify/live-service checks.
- Authenticated flows and admin access still require Sprint 1 integration.

## Recommended Claude sequence

1. Confirm `main` is at or after `eab6522`.
2. Review and complete Sprint 1 Auth/RBAC.
3. Validate every Sprint 1 integration point used by Sprints 3–6.
4. Review PR #2 for checkout security, inventory concurrency, and webhook idempotency.
5. Review PR #3 for admin authorization, CSV import, and R2 operations.
6. Review PR #4 for review/wishlist ownership and recommendation queries.
7. Review PR #5 for promo concurrency and reporting queries.
8. Inspect and apply all Drizzle migrations in the intended environment.
9. Complete Sprint 7 deployment configuration.
10. Run every applicable live check in `docs/DEPLOYMENT.md`.
11. Only then mark the remaining Definition of Done items complete.
