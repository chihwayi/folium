# Sprint 4 — Admin Back Office

## Goal
The owner and staff can run the store without touching the database directly.

## Deliverables
- Catalog CRUD: create/edit/delete books, categories, cover image upload (R2)
- Bulk import (CSV) for adding many books at once
- Inventory management: stock levels, low-stock indicator
- Order management: view orders, update fulfillment status
      (pending → packed → shipped → delivered)
- Staff management: invite staff, assign roles (owner only)

## Tasks
- [ ] Admin layout/nav (`(admin)/admin`), role-gated
- [ ] Book create/edit form with R2 image upload
- [ ] CSV bulk import (parse, validate, batch insert)
- [ ] Inventory table with inline stock edit + low-stock flag
- [ ] Orders table with status transitions + filters
- [ ] Staff list + invite flow (owner-only), role assignment

## Definition of Done
A staff account can add a new book with cover image end-to-end, and an owner can
change an order's status and see it reflected on the customer's order page.
