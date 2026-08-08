import "server-only";

import { redirect } from "next/navigation";

export type AdminActor = { id: string; role: "staff" | "owner" };

/** Sprint 1 replaces this deny-by-default adapter with its Auth.js session lookup. */
export async function getAdminActor(): Promise<AdminActor | null> {
  return null;
}

export async function requireAdmin() {
  const actor = await getAdminActor();
  if (!actor) redirect("/login?callbackUrl=/admin");
  return actor;
}

export async function requireOwner() {
  const actor = await requireAdmin();
  if (actor.role !== "owner") redirect("/admin");
  return actor;
}
