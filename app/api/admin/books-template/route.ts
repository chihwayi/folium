import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";

// Escapes a value for CSV: wraps in quotes and doubles any embedded quotes,
// per RFC 4180 — needed since book titles/descriptions routinely contain
// commas.
function csvField(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET() {
  await requireAdmin();

  const rows = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .orderBy(asc(categories.name));
  const exampleCategoryId = rows[0]?.id ?? "PASTE-A-CATEGORY-ID-FROM-BELOW";

  const headers = [
    "title",
    "slug",
    "author",
    "description",
    "priceCents",
    "categoryId",
    "format",
    "isbn",
    "stockQuantity",
    "coverImageUrl",
  ];

  const exampleRow = [
    "The Hobbit",
    "the-hobbit",
    "J.R.R. Tolkien",
    "Bilbo Baggins is swept into an epic quest.",
    "1499",
    exampleCategoryId,
    "hardcover",
    "9780547928227",
    "12",
    "",
  ];

  const lines = [
    headers.join(","),
    exampleRow.map(csvField).join(","),
    "",
    "# Delete the two lines above before importing — they're an example row, not a header comment.",
    "# format must be exactly one of: paperback, hardcover, ebook",
    "# priceCents and stockQuantity are whole numbers (price in cents, e.g. 1499 = $14.99)",
    "# description, isbn, and coverImageUrl can be left blank",
    "# coverImageUrl must already be a working image URL — CSV import doesn't upload files;",
    "#   use the cover upload button on a book's edit page for that instead",
    "# categoryId must be one of the IDs below, copied exactly",
    "#",
    "# Your categories:",
    ...rows.map((category) => `# ${category.name} -> ${category.id}`),
  ];

  return new NextResponse(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="folium-books-template.csv"',
    },
  });
}
