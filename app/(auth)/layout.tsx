import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-secondary/45 px-6 py-16">
      <div className="grain-overlay opacity-[0.05]" aria-hidden="true" />
      <Link href="/" className="relative flex items-center gap-2 font-serif text-2xl font-semibold">
        <BookOpen className="size-6 text-primary" aria-hidden="true" /> Folium
      </Link>
      <div className="relative mt-8 w-full max-w-sm rounded-xl border bg-card p-7 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.25)] before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-accent/70 before:to-transparent">
        {children}
      </div>
    </main>
  );
}
