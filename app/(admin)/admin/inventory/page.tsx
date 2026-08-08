import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { books, inventory } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { updateStock } from "../actions";

export default async function InventoryPage() {
  const rows = await db.select({ id: inventory.id, title: books.title, stock: inventory.stockQuantity, threshold: inventory.lowStockThreshold }).from(inventory).innerJoin(books, eq(books.id, inventory.bookId)).orderBy(asc(books.title));
  return <><h1 className="font-serif text-4xl">Inventory</h1><div className="mt-8 overflow-x-auto rounded-xl border bg-card"><table className="w-full text-left text-sm"><thead className="border-b bg-muted/50"><tr><th className="p-4">Book</th><th className="p-4">Stock</th><th className="p-4">Low at</th><th className="p-4">State</th><th /></tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-b last:border-0"><td className="p-4 font-medium">{row.title}</td><td colSpan={4}><form action={updateStock} className="grid grid-cols-[80px_80px_1fr_auto] items-center gap-3 p-3"><input type="hidden" name="id" value={row.id}/><input className="h-9 rounded border px-2" name="stockQuantity" type="number" min="0" defaultValue={row.stock}/><input className="h-9 rounded border px-2" name="lowStockThreshold" type="number" min="0" defaultValue={row.threshold}/><span className={row.stock <= row.threshold ? "font-medium text-destructive" : "text-muted-foreground"}>{row.stock <= row.threshold ? "Low stock" : "Healthy"}</span><Button size="sm">Save</Button></form></td></tr>)}</tbody></table></div></>;
}
