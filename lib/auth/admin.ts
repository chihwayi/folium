import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

export type AdminActor = { id: string; role: "staff" | "owner" };

// Middleware (proxy.ts) gates /admin/* at the edge, but Server Actions and
// route handlers under /admin must call this too — middleware can be
// misconfigured or bypassed for a specific action, so each privileged
// mutation re-checks role server-side (defense in depth).
export async function getAdminActor(): Promise<AdminActor | null> {
  const session = await auth();
  if (!session?.user) return null;
  if (session.user.role !== "staff" && session.user.role !== "owner") return null;
  return { id: session.user.id, role: session.user.role };
}

export async function requireAdmin() {
  const actor = await getAdminActor();
  if (!actor) redirect("/sign-in?callbackUrl=/admin");
  return actor;
}

export async function requireOwner() {
  const actor = await requireAdmin();
  if (actor.role !== "owner") redirect("/admin");
  return actor;
}
