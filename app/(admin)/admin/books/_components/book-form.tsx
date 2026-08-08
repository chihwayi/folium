"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { saveBook, uploadCover } from "../../actions";

type Category = { id: string; name: string };
type Book = { id: string; title: string; slug: string; author: string; description: string | null; priceCents: number; categoryId: string; format: "paperback" | "hardcover" | "ebook"; isbn: string | null; coverImageUrl: string | null; stockQuantity: number };

export function BookForm({ categories, book }: { categories: Category[]; book?: Book }) {
  const [coverUrl, setCoverUrl] = useState(book?.coverImageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  async function handleUpload(formData: FormData) {
    setUploading(true);
    try { const result = await uploadCover(formData); setCoverUrl(result.url); }
    finally { setUploading(false); }
  }
  const field = "h-10 w-full rounded-md border bg-background px-3 text-sm";
  return <form action={saveBook} className="mt-8 grid gap-6 rounded-xl border bg-card p-6 md:grid-cols-2">
    {book && <input type="hidden" name="id" value={book.id}/>}<input type="hidden" name="coverImageUrl" value={coverUrl}/>
    <label className="grid gap-2 text-sm">Title<input className={field} name="title" required defaultValue={book?.title}/></label>
    <label className="grid gap-2 text-sm">URL slug<input className={field} name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={book?.slug}/></label>
    <label className="grid gap-2 text-sm">Author<input className={field} name="author" required defaultValue={book?.author}/></label>
    <label className="grid gap-2 text-sm">ISBN<input className={field} name="isbn" defaultValue={book?.isbn ?? ""}/></label>
    <label className="grid gap-2 text-sm">Price (cents)<input className={field} name="priceCents" type="number" min="0" required defaultValue={book?.priceCents}/></label>
    <label className="grid gap-2 text-sm">Opening stock<input className={field} name="stockQuantity" type="number" min="0" required defaultValue={book?.stockQuantity ?? 0}/></label>
    <label className="grid gap-2 text-sm">Category<select className={field} name="categoryId" required defaultValue={book?.categoryId}>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
    <label className="grid gap-2 text-sm">Format<select className={field} name="format" defaultValue={book?.format ?? "paperback"}><option value="paperback">Paperback</option><option value="hardcover">Hardcover</option><option value="ebook">Ebook</option></select></label>
    <label className="grid gap-2 text-sm md:col-span-2">Description<textarea className="min-h-36 rounded-md border bg-background p-3" name="description" defaultValue={book?.description ?? ""}/></label>
    <div className="md:col-span-2"><p className="mb-2 text-sm">Cover image</p><div className="flex flex-wrap items-center gap-3">{coverUrl && <Image src={coverUrl} alt="Uploaded cover preview" width={64} height={96} unoptimized className="h-24 w-16 rounded object-cover"/>}<input name="cover" type="file" accept="image/jpeg,image/png,image/webp,image/avif"/><Button formAction={handleUpload} formNoValidate variant="outline" disabled={uploading}>{uploading ? "Uploading…" : "Upload cover"}</Button></div></div>
    <div className="md:col-span-2"><Button type="submit">{book ? "Save changes" : "Create book"}</Button></div>
  </form>;
}
