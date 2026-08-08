# Sprint 2 — Catalog & Storefront

## Goal
Customers can browse and find books. This is the core shopping experience.

## Deliverables
- Book listing pages by category with pagination
- Book detail page: cover, description, price, author, sample excerpt, stock status
- Faceted filtering (genre, author, price range, format)
- Instant search powered by Meilisearch (typo-tolerant, sub-100ms)
- Category/collection landing pages

## Tasks
- [ ] Book listing grid component (premium card design — cover-forward)
- [ ] Book detail page with structured data (SEO: JSON-LD `Book`/`Product`)
- [ ] Sync Drizzle `books` table → Meilisearch index (on create/update)
- [ ] Search bar with instant results (debounced, keyboard nav)
- [ ] Filter/sort UI (price, newest, bestselling placeholder)
- [ ] Category pages with curated ordering

## Definition of Done
A visitor can search "tolkien", get instant relevant results, filter by category, and
land on a fully rendered book detail page.
