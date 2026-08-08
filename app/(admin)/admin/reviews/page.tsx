import { desc, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { books, reviews, users } from "@/db/schema";
import { moderateReview } from "../actions";
export default async function ReviewsPage() {
  const rows = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      approved: reviews.isApproved,
      book: books.title,
      reader: users.name,
    })
    .from(reviews)
    .innerJoin(books, eq(books.id, reviews.bookId))
    .innerJoin(users, eq(users.id, reviews.userId))
    .orderBy(desc(reviews.createdAt));
  return (
    <>
      <h1 className="font-serif text-4xl">Review moderation</h1>
      <div className="mt-8 space-y-3">
        {rows.map((row) => (
          <article className="rounded-xl border bg-card p-5" key={row.id}>
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-medium">
                  {row.book} · {"★".repeat(row.rating)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {row.reader ?? "Reader"} ·{" "}
                  {row.approved ? "Published" : "Awaiting review"}
                </p>
              </div>
              <form action={moderateReview}>
                <input type="hidden" name="id" value={row.id} />
                <input
                  type="hidden"
                  name="approved"
                  value={row.approved ? "false" : "true"}
                />
                <Button
                  size="sm"
                  variant={row.approved ? "outline" : "default"}
                >
                  {row.approved ? "Unpublish" : "Approve"}
                </Button>
              </form>
            </div>
            {row.title && (
              <h2 className="mt-4 font-serif text-xl">{row.title}</h2>
            )}
            <p className="mt-2 text-sm leading-6">{row.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}
