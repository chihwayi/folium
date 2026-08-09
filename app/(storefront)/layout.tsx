import Link from "next/link";

import { SiteHeader } from "@/components/site-header";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <footer className="mt-auto border-t px-6 py-8 text-center text-sm text-muted-foreground">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Legal">
          <Link href="/privacy" className="hover:text-primary">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary">
            Terms of Service
          </Link>
          <Link href="/returns" className="hover:text-primary">
            Returns &amp; Refunds
          </Link>
        </nav>
        <p className="mt-4">Folium — books worth keeping.</p>
      </footer>
    </>
  );
}
