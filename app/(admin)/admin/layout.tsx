import {
  BookOpen,
  Boxes,
  FolderTree,
  LayoutDashboard,
  LibraryBig,
  MessageSquareText,
  PackageCheck,
  Tags,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { signOutAction } from "@/app/(auth)/actions";
import { requireAdmin } from "@/lib/auth/admin";

const links = [
  ["Overview", "/admin", LayoutDashboard],
  ["Catalog", "/admin/books", BookOpen],
  ["Categories", "/admin/categories", FolderTree],
  ["Collections", "/admin/collections", LibraryBig],
  ["Reviews", "/admin/reviews", MessageSquareText],
  ["Inventory", "/admin/inventory", Boxes],
  ["Orders", "/admin/orders", PackageCheck],
  ["Promotions", "/admin/promotions", Tags],
  ["Staff", "/admin/staff", Users],
] as const;

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const actor = await requireAdmin();
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-serif text-2xl">
            Folium Admin
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {actor.role}
            </p>
            <Link href="/" className="text-muted-foreground hover:text-primary">
              View store
            </Link>
            <form action={signOutAction}>
              <button type="submit" className="text-muted-foreground hover:text-primary">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl md:grid-cols-[210px_1fr]">
        <nav
          className="flex gap-2 overflow-x-auto border-b bg-background p-4 md:min-h-[calc(100vh-65px)] md:flex-col md:border-r md:border-b-0"
          aria-label="Admin navigation"
        >
          {links.map(([label, href, Icon]) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-secondary"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <main className="min-w-0 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
