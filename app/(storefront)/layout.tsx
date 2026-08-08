import { SiteHeader } from "@/components/site-header";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return <><SiteHeader />{children}<footer className="mt-auto border-t px-6 py-8 text-center text-sm text-muted-foreground">Folium — books worth keeping.</footer></>;
}
