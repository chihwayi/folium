import { asc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { deleteCategory, saveCategory } from "../actions";

export default async function CategoriesPage() {
  const rows = await db.select().from(categories).orderBy(asc(categories.name)); const field = "h-10 rounded-md border bg-background px-3 text-sm";
  return <><h1 className="font-serif text-4xl">Categories</h1><form action={saveCategory} className="mt-8 grid gap-3 rounded-xl border bg-card p-5 md:grid-cols-[1fr_1fr_2fr_auto]"><input className={field} name="name" placeholder="Name" required/><input className={field} name="slug" placeholder="slug" required/><input className={field} name="description" placeholder="Description"/><Button>Add category</Button></form><div className="mt-6 divide-y rounded-xl border bg-card">{rows.map(row => <form action={saveCategory} key={row.id} className="grid gap-3 p-4 md:grid-cols-[1fr_1fr_2fr_auto_auto]"><input type="hidden" name="id" value={row.id}/><input className={field} name="name" defaultValue={row.name}/><input className={field} name="slug" defaultValue={row.slug}/><input className={field} name="description" defaultValue={row.description ?? ""}/><Button variant="outline">Save</Button><Button formAction={deleteCategory} variant="destructive">Delete</Button></form>)}</div></>;
}
