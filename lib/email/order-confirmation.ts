import "server-only";

import { eq } from "drizzle-orm";
import { Resend } from "resend";

import { db } from "@/db";
import { books, orderItems, orders } from "@/db/schema";
import { formatPrice } from "@/lib/catalog/format";

let resendClient: Resend | undefined;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  resendClient ??= new Resend(apiKey);
  return resendClient;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

export async function sendOrderConfirmation(orderId: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order || order.confirmationEmailSentAt) return;

  const items = await db
    .select({ title: books.title, quantity: orderItems.quantity, unitPriceCents: orderItems.unitPriceCents })
    .from(orderItems)
    .innerJoin(books, eq(books.id, orderItems.bookId))
    .where(eq(orderItems.orderId, orderId));

  const rows = items.map((item) => `<tr><td style="padding:8px 0">${escapeHtml(item.title)} × ${item.quantity}</td><td style="padding:8px 0;text-align:right">${formatPrice(item.unitPriceCents * item.quantity)}</td></tr>`).join("");
  const { error } = await getResendClient().emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Folium <orders@example.com>",
    to: order.customerEmail,
    subject: `Your Folium order ${order.id.slice(0, 8)} is confirmed`,
    html: `<div style="max-width:600px;margin:auto;font-family:Georgia,serif;color:#2f2a24"><h1>Thank you for your order.</h1><p>We’re preparing your books for their journey to you.</p><table style="width:100%;border-collapse:collapse">${rows}<tr style="border-top:1px solid #ddd"><td style="padding:12px 0"><strong>Total</strong></td><td style="padding:12px 0;text-align:right"><strong>${formatPrice(order.totalCents)}</strong></td></tr></table><p style="color:#6b6258">Ship to ${escapeHtml(order.shippingName)}, ${escapeHtml(order.shippingCity)}, ${escapeHtml(order.shippingCountry)}</p></div>`,
  }, { idempotencyKey: `order-confirmation/${order.id}` });

  if (error) throw new Error(`Resend rejected order confirmation: ${error.message}`);
  await db.update(orders).set({ confirmationEmailSentAt: new Date(), updatedAt: new Date() }).where(eq(orders.id, order.id));
}
