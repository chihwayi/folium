# Sprint 3 — Cart & Checkout

## Goal
End-to-end purchase flow: add to cart through paid order.

## Deliverables
- Persistent cart (DB-backed for logged-in users, cookie/local for guests)
- Guest checkout + logged-in checkout
- Stripe Checkout (or Payment Element) integration
- Order creation on successful payment (via Stripe webhook)
- Order confirmation email (Resend)
- Order history in customer account area

## Tasks
- [ ] Cart state (add/remove/update qty), cart drawer UI
- [ ] Checkout page: shipping address, order summary
- [ ] Stripe integration: create PaymentIntent/Checkout Session
- [ ] Webhook handler: verify signature, create `order` + `order_items`, decrement
      inventory
- [ ] Order confirmation email
- [ ] "My Orders" page with status

## Definition of Done
A test purchase (Stripe test mode) goes from cart → payment → order recorded in DB →
confirmation email received.
