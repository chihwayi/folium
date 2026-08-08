"use server";

import { createHash, randomBytes } from "node:crypto";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { books, categories, inventory, orders, staffInvitations, users } from "@/db/schema";
import { requireAdmin, requireOwner } from "@/lib/auth/admin";

const uuid = z.uuid();
const bookSchema = z.object({
  id: z.uuid().optional(), title: z.string().trim().min(1).max(200), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  author: z.string().trim().min(1).max(160), description: z.string().trim().max(10_000).optional(), priceCents: z.coerce.number().int().nonnegative(),
  categoryId: z.uuid(), format: z.enum(["paperback", "hardcover", "ebook"]), isbn: z.string().trim().max(32).optional(), stockQuantity: z.coerce.number().int().nonnegative(),
  coverImageUrl: z.url().optional().or(z.literal("")),
});

export async function saveBook(formData: FormData) {
  await requireAdmin();
  const input = bookSchema.parse(Object.fromEntries(formData));
  await db.transaction(async (tx) => {
    const values = { title: input.title, slug: input.slug, author: input.author, description: input.description || null, priceCents: input.priceCents, categoryId: input.categoryId, format: input.format, isbn: input.isbn || null, coverImageUrl: input.coverImageUrl || null, updatedAt: new Date() };
    if (input.id) {
      await tx.update(books).set(values).where(eq(books.id, input.id));
      await tx.update(inventory).set({ stockQuantity: input.stockQuantity, updatedAt: new Date() }).where(eq(inventory.bookId, input.id));
    } else {
      const [book] = await tx.insert(books).values(values).returning({ id: books.id });
      await tx.insert(inventory).values({ bookId: book.id, stockQuantity: input.stockQuantity });
    }
  });
  revalidatePath("/admin/books"); revalidatePath("/books");
}

export async function deleteBook(formData: FormData) {
  await requireAdmin(); const id = uuid.parse(formData.get("id"));
  await db.delete(books).where(eq(books.id, id));
  revalidatePath("/admin/books"); revalidatePath("/books");
}

const categorySchema = z.object({ id: z.uuid().optional(), name: z.string().trim().min(1).max(100), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().trim().max(1000).optional() });
export async function saveCategory(formData: FormData) {
  await requireAdmin(); const input = categorySchema.parse(Object.fromEntries(formData));
  const values = { name: input.name, slug: input.slug, description: input.description || null, updatedAt: new Date() };
  if (input.id) await db.update(categories).set(values).where(eq(categories.id, input.id));
  else await db.insert(categories).values(values);
  revalidatePath("/admin/categories"); revalidatePath("/books");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin(); const id = uuid.parse(formData.get("id"));
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
}

const csvRowSchema = bookSchema.omit({ id: true, coverImageUrl: true }).extend({ coverImageUrl: z.string().optional() });
function parseCsv(source: string) {
  const rows: string[][] = []; let row: string[] = []; let field = ""; let quoted = false;
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    if (char === '"' && quoted && source[index + 1] === '"') { field += '"'; index++; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(field); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) { if (char === "\r" && source[index + 1] === "\n") index++; row.push(field); if (row.some(Boolean)) rows.push(row); row = []; field = ""; }
    else field += char;
  }
  row.push(field); if (row.some(Boolean)) rows.push(row);
  const [headers, ...data] = rows; if (!headers) throw new Error("CSV is empty");
  return data.map((values) => Object.fromEntries(headers.map((header, index) => [header.trim(), values[index]?.trim() ?? ""])));
}

export async function importBooks(formData: FormData) {
  await requireAdmin(); const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0 || file.size > 2_000_000) throw new Error("Choose a CSV file smaller than 2 MB");
  const parsed = z.array(csvRowSchema).min(1).max(1000).parse(parseCsv(await file.text()));
  await db.transaction(async (tx) => {
    for (const input of parsed) {
      const [book] = await tx.insert(books).values({ title: input.title, slug: input.slug, author: input.author, description: input.description || null, priceCents: input.priceCents, categoryId: input.categoryId, format: input.format, isbn: input.isbn || null, coverImageUrl: input.coverImageUrl || null }).returning({ id: books.id });
      await tx.insert(inventory).values({ bookId: book.id, stockQuantity: input.stockQuantity });
    }
  });
  revalidatePath("/admin/books"); revalidatePath("/books");
}

function r2Client() {
  const accountId = z.string().min(1).parse(process.env.R2_ACCOUNT_ID);
  return new S3Client({ region: "auto", endpoint: `https://${accountId}.r2.cloudflarestorage.com`, credentials: { accessKeyId: z.string().min(1).parse(process.env.R2_ACCESS_KEY_ID), secretAccessKey: z.string().min(1).parse(process.env.R2_SECRET_ACCESS_KEY) } });
}
const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const imageExtensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
export async function uploadCover(formData: FormData) {
  await requireAdmin(); const file = formData.get("cover");
  if (!(file instanceof File) || !imageTypes.has(file.type) || file.size > 5_000_000) throw new Error("Cover must be JPEG, PNG, WebP, or AVIF and no larger than 5 MB");
  const bucket = z.string().min(1).parse(process.env.R2_BUCKET_NAME); const publicUrl = z.url().parse(process.env.R2_PUBLIC_URL);
  const key = `covers/${crypto.randomUUID()}.${imageExtensions[file.type]}`;
  await r2Client().send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: Buffer.from(await file.arrayBuffer()), ContentType: file.type }));
  return { key, url: `${publicUrl.replace(/\/$/, "")}/${key}` };
}

export async function deleteCover(key: string) {
  await requireAdmin(); const safeKey = z.string().regex(/^covers\/[a-f0-9-]+\.(?:jpe?g|png|webp|avif)$/).parse(key);
  await r2Client().send(new DeleteObjectCommand({ Bucket: z.string().min(1).parse(process.env.R2_BUCKET_NAME), Key: safeKey }));
}

const stockSchema = z.object({ id: z.uuid(), stockQuantity: z.coerce.number().int().nonnegative(), lowStockThreshold: z.coerce.number().int().nonnegative() });
export async function updateStock(formData: FormData) {
  await requireAdmin(); const input = stockSchema.parse(Object.fromEntries(formData));
  await db.update(inventory).set({ stockQuantity: input.stockQuantity, lowStockThreshold: input.lowStockThreshold, updatedAt: new Date() }).where(eq(inventory.id, input.id));
  revalidatePath("/admin/inventory");
}

const transitions = { pending: ["paid", "cancelled"], paid: ["packed", "cancelled"], packed: ["shipped"], shipped: ["delivered"], delivered: [], cancelled: [] } as const;
const orderSchema = z.object({ id: z.uuid(), status: z.enum(["pending", "paid", "packed", "shipped", "delivered", "cancelled"]) });
export async function updateOrderStatus(formData: FormData) {
  await requireAdmin(); const input = orderSchema.parse(Object.fromEntries(formData));
  const [order] = await db.select({ status: orders.status }).from(orders).where(eq(orders.id, input.id)).limit(1);
  if (!order || !(transitions[order.status] as readonly string[]).includes(input.status)) throw new Error("Invalid order status transition");
  await db.update(orders).set({ status: input.status, updatedAt: new Date() }).where(eq(orders.id, input.id));
  revalidatePath("/admin/orders"); revalidatePath("/account/orders");
}

const roleSchema = z.object({ id: z.uuid(), role: z.enum(["customer", "staff", "owner"]) });
export async function updateUserRole(formData: FormData) {
  const actor = await requireOwner(); const input = roleSchema.parse(Object.fromEntries(formData));
  if (input.id === actor.id && input.role !== "owner") throw new Error("Owners cannot remove their own access");
  await db.update(users).set({ role: input.role, updatedAt: new Date() }).where(eq(users.id, input.id));
  revalidatePath("/admin/staff");
}

const inviteSchema = z.object({ email: z.email(), role: z.enum(["staff", "owner"]) });
export async function inviteStaff(formData: FormData) {
  const actor = await requireOwner(); const input = inviteSchema.parse(Object.fromEntries(formData));
  const token = randomBytes(32).toString("base64url");
  await db.insert(staffInvitations).values({ email: input.email.toLowerCase(), role: input.role, tokenHash: createHash("sha256").update(token).digest("hex"), invitedById: actor.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  // Sprint 1 owns the acceptance route and email delivery; only the hash is persisted here.
  revalidatePath("/admin/staff");
}
