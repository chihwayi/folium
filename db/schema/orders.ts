import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { books } from "./catalog";
import { users } from "./users";

export const orderStatus = pgEnum("order_status", [
  "pending",
  "paid",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Nullable: guest checkout (Sprint 3) has no user account.
    userId: uuid("user_id").references(() => users.id, { onDelete: "restrict" }),
    status: orderStatus("status").notNull().default("pending"),
    totalCents: integer("total_cents").notNull(),
    customerEmail: text("customer_email").notNull(),
    shippingName: text("shipping_name").notNull(),
    shippingAddressLine1: text("shipping_address_line_1").notNull(),
    shippingAddressLine2: text("shipping_address_line_2"),
    shippingCity: text("shipping_city").notNull(),
    shippingState: text("shipping_state"),
    shippingPostalCode: text("shipping_postal_code").notNull(),
    shippingCountry: text("shipping_country").notNull(),
    stripeCheckoutSessionId: text("stripe_checkout_session_id").notNull(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    confirmationEmailSentAt: timestamp("confirmation_email_sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("orders_user_id_idx").on(table.userId),
    index("orders_customer_email_idx").on(table.customerEmail),
    uniqueIndex("orders_stripe_checkout_session_unique").on(table.stripeCheckoutSessionId),
    uniqueIndex("orders_stripe_payment_intent_unique").on(table.stripePaymentIntentId),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    unitPriceCents: integer("unit_price_cents").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_book_id_idx").on(table.bookId),
  ],
);
