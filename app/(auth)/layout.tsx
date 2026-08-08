import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="font-serif text-2xl">
        Folium
      </Link>
      <div className="mt-8 w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm">{children}</div>
    </main>
  );
}
