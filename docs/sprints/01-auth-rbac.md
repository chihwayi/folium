# Sprint 1 — Auth & RBAC

## Goal
Working authentication for customers and staff, with role-based access separating
the storefront from the back office.

## Deliverables
- Auth.js configured (email/password + optionally Google OAuth for customers)
- `role` column on `users`: `customer`, `staff`, `owner`
- `(admin)` route group protected — only `staff`/`owner` can enter
- Session-aware header (sign in/out, account link)
- Password reset flow (via Resend)

## Tasks
- [ ] Install & configure Auth.js with Drizzle adapter
- [ ] Sign up / sign in / sign out pages (storefront-styled)
- [ ] Middleware guarding `/admin/*` by role
- [ ] Seed script to create an initial `owner` account
- [ ] Password reset email flow via Resend
- [ ] Basic account settings page (name, email, password)

## Definition of Done
A customer can register and log in; a staff/owner account can reach `/admin` while a
plain customer is redirected away from it.
