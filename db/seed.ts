// Minimal catalog seed for local/staging use ahead of Sprint 4's admin CRUD
// (there's no book-creation UI yet, so this is the only way to exercise the
// storefront and the Meilisearch sync helpers end-to-end pre-Sprint-4).
import { eq } from "drizzle-orm";
import { db } from "./index";
import { books, categories, inventory } from "./schema";
import { reindexCatalog } from "../lib/catalog/search-index";

async function categoryId(slug: string, name: string, description: string) {
  await db.insert(categories).values({ name, slug, description }).onConflictDoNothing({ target: categories.slug });
  const [row] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, slug)).limit(1);
  return row.id;
}

async function seed() {
  const fictionId = await categoryId("fiction", "Fiction", "Character-driven stories, literary and contemporary.");
  const fantasyId = await categoryId("fantasy", "Fantasy", "Worlds beyond this one.");

  const seededBooks = await db
    .insert(books)
    .values([
      {
        title: "The Fellowship of the Ring",
        slug: "the-fellowship-of-the-ring",
        author: "J.R.R. Tolkien",
        description: "The first volume of The Lord of the Rings.",
        sampleExcerpt: "When Mr. Bilbo Baggins of Bag End announced that he would shortly be celebrating his eleventy-first birthday...",
        priceCents: 1899,
        categoryId: fantasyId,
        format: "paperback",
        publishedAt: new Date("1954-07-29"),
        curatedPosition: 1,
      },
      {
        title: "The Hobbit",
        slug: "the-hobbit",
        author: "J.R.R. Tolkien",
        description: "Bilbo Baggins is swept into an epic quest.",
        sampleExcerpt: "In a hole in the ground there lived a hobbit.",
        priceCents: 1499,
        categoryId: fantasyId,
        format: "hardcover",
        publishedAt: new Date("1937-09-21"),
        curatedPosition: 2,
      },
      {
        title: "Klara and the Sun",
        slug: "klara-and-the-sun",
        author: "Kazuo Ishiguro",
        description: "A solar-powered Artificial Friend observes the world.",
        sampleExcerpt: "When we were new, Rosa and I were mid-store, on the magazines table side.",
        priceCents: 1699,
        categoryId: fictionId,
        format: "paperback",
        publishedAt: new Date("2021-03-02"),
        curatedPosition: 3,
      },
    ])
    .onConflictDoNothing({ target: books.slug })
    .returning();

  if (seededBooks.length > 0) {
    await db
      .insert(inventory)
      .values(seededBooks.map((book) => ({ bookId: book.id, stockQuantity: 12, lowStockThreshold: 3 })))
      .onConflictDoNothing({ target: inventory.bookId });
  }

  const indexed = await reindexCatalog();
  console.log(`Seeded ${seededBooks.length} new book(s); reindexed catalog into Meilisearch (${indexed ? "ok" : "no rows to index"}).`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
