import { asc } from "drizzle-orm";

import { archivePromoCode, savePromoCode } from "@/app/(admin)/admin/actions";
import { db } from "@/db";
import { promoCodes } from "@/db/schema";

import { ExpiryField } from "./_components/expiry-field";

function PromoForm({ promo }: { promo?: typeof promoCodes.$inferSelect }) {
  return (
    <form
      action={savePromoCode}
      className="grid gap-3 rounded-xl border bg-card p-5 md:grid-cols-2"
    >
      {promo && <input type="hidden" name="id" value={promo.id} />}
      <input
        name="code"
        required
        defaultValue={promo?.code}
        placeholder="READ20"
        className="rounded-md border bg-background px-3 py-2"
      />
      <input
        name="description"
        defaultValue={promo?.description ?? ""}
        placeholder="Description"
        className="rounded-md border bg-background px-3 py-2"
      />
      <select
        name="type"
        defaultValue={promo?.type ?? "percentage"}
        className="rounded-md border bg-background px-3 py-2"
      >
        <option value="percentage">Percentage</option>
        <option value="fixed">Fixed amount (cents)</option>
      </select>
      <input
        name="value"
        type="number"
        min="1"
        required
        defaultValue={promo?.value}
        placeholder="Value"
        className="rounded-md border bg-background px-3 py-2"
      />
      <ExpiryField defaultValueUtcIso={promo?.expiresAt?.toISOString()} />
      <input
        name="usageLimit"
        type="number"
        min="1"
        defaultValue={promo?.usageLimit ?? ""}
        placeholder="Usage limit (optional)"
        className="rounded-md border bg-background px-3 py-2"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={promo?.isActive ?? true}
        />{" "}
        Active
      </label>
      <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        {promo ? "Save changes" : "Create promo code"}
      </button>
    </form>
  );
}

export default async function PromotionsPage() {
  const promos = await db
    .select()
    .from(promoCodes)
    .orderBy(asc(promoCodes.code));
  return (
    <div>
      <p className="text-sm font-medium text-primary">Growth</p>
      <h1 className="mt-2 font-serif text-4xl">Promo codes</h1>
      <p className="mt-3 text-muted-foreground">
        Create percentage or fixed-value offers with expiry dates and redemption
        limits.
      </p>
      <div className="mt-8">
        <PromoForm />
      </div>
      <div className="mt-8 space-y-4">
        {promos.length === 0 && (
          <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            No promo codes yet.
          </p>
        )}
        {promos.map((promo) => (
          <section
            key={promo.id}
            className="space-y-4 rounded-xl border bg-card p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-mono text-lg font-semibold">
                  {promo.code}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Used {promo.usageCount}
                  {promo.usageLimit
                    ? ` of ${promo.usageLimit}`
                    : " times"} · {promo.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              {promo.isActive && (
                <form action={archivePromoCode}>
                  <input type="hidden" name="id" value={promo.id} />
                  <button className="text-sm text-destructive hover:underline">
                    Deactivate
                  </button>
                </form>
              )}
            </div>
            <PromoForm promo={promo} />
          </section>
        ))}
      </div>
    </div>
  );
}
