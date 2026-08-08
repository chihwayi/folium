import { asc, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { books, collectionBooks, collections } from "@/db/schema";
import {
  addCollectionBook,
  removeCollectionBook,
  saveCollection,
} from "../actions";

export default async function CollectionsPage() {
  const [sections, titles, entries] = await Promise.all([
    db.select().from(collections).orderBy(asc(collections.position)),
    db
      .select({ id: books.id, title: books.title })
      .from(books)
      .orderBy(asc(books.title)),
    db
      .select({
        id: collectionBooks.id,
        collectionId: collectionBooks.collectionId,
        title: books.title,
        position: collectionBooks.position,
      })
      .from(collectionBooks)
      .innerJoin(books, eq(books.id, collectionBooks.bookId))
      .orderBy(asc(collectionBooks.position)),
  ]);
  const input = "h-10 rounded-md border bg-background px-3 text-sm";
  return (
    <>
      <h1 className="font-serif text-4xl">Homepage collections</h1>
      <form
        action={saveCollection}
        className="mt-8 grid gap-3 rounded-xl border bg-card p-5 md:grid-cols-3"
      >
        <input
          className={input}
          name="title"
          placeholder="Staff Picks"
          required
        />
        <input
          className={input}
          name="slug"
          placeholder="staff-picks"
          required
        />
        <input
          className={input}
          name="eyebrow"
          placeholder="From behind the counter"
        />
        <input
          className={input}
          name="description"
          placeholder="Section introduction"
        />
        <input
          className={input}
          name="position"
          type="number"
          min="0"
          defaultValue="0"
        />
        <label className="flex items-center gap-2 text-sm">
          <input name="isPublished" type="checkbox" />
          Published
        </label>
        <Button className="md:col-span-3">Create collection</Button>
      </form>
      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <section className="rounded-xl border bg-card p-5" key={section.id}>
            <form action={saveCollection} className="grid gap-3 md:grid-cols-3">
              <input type="hidden" name="id" value={section.id} />
              <input
                className={input}
                name="title"
                defaultValue={section.title}
              />
              <input
                className={input}
                name="slug"
                defaultValue={section.slug}
              />
              <input
                className={input}
                name="eyebrow"
                defaultValue={section.eyebrow ?? ""}
              />
              <input
                className={input}
                name="description"
                defaultValue={section.description ?? ""}
              />
              <input
                className={input}
                name="position"
                type="number"
                min="0"
                defaultValue={section.position}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  name="isPublished"
                  type="checkbox"
                  defaultChecked={section.isPublished}
                />
                Published
              </label>
              <Button variant="outline">Save section</Button>
            </form>
            <div className="mt-5 border-t pt-5">
              <form action={addCollectionBook} className="flex flex-wrap gap-2">
                <input type="hidden" name="collectionId" value={section.id} />
                <select className={input} name="bookId">
                  {titles.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title}
                    </option>
                  ))}
                </select>
                <input
                  className={`${input} w-24`}
                  name="position"
                  type="number"
                  min="0"
                  defaultValue="0"
                />
                <Button>Add book</Button>
              </form>
              <ul className="mt-3 divide-y">
                {entries
                  .filter((entry) => entry.collectionId === section.id)
                  .map((entry) => (
                    <li
                      className="flex justify-between py-2 text-sm"
                      key={entry.id}
                    >
                      <span>
                        {entry.position}. {entry.title}
                      </span>
                      <form action={removeCollectionBook}>
                        <input type="hidden" name="id" value={entry.id} />
                        <Button size="sm" variant="ghost">
                          Remove
                        </Button>
                      </form>
                    </li>
                  ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
