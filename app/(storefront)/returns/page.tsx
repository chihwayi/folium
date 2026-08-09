import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns & Refunds | Folium" };

export default function ReturnsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <p className="text-xs font-semibold tracking-[.2em] text-primary uppercase">Legal</p>
      <h1 className="mt-2 font-serif text-4xl">Returns &amp; Refunds</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated August 9, 2026.</p>

      <div className="mt-10 space-y-8 leading-7 text-muted-foreground">
        <section>
          <h2 className="font-serif text-xl text-foreground">30-day returns</h2>
          <p className="mt-3">
            If a book isn&rsquo;t right for you, you can return it within 30 days of delivery for a full refund of
            the item price. Books should be in the condition you received them &mdash; readable, but we can&rsquo;t
            accept books back if the cover or pages have been damaged beyond normal handling.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Damaged or incorrect orders</h2>
          <p className="mt-3">
            If your order arrives damaged, or you received the wrong book, contact us within 14 days of delivery
            with a photo of the issue and we&rsquo;ll send a replacement or refund at no cost to you &mdash;
            including return shipping, if a return is needed.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">How to start a return</h2>
          <p className="mt-3">
            Email{" "}
            <a href="mailto:orders@folium.example" className="text-primary hover:underline">
              orders@folium.example
            </a>{" "}
            with your order reference (found on your order confirmation and in your account&rsquo;s order history)
            and which book you&rsquo;d like to return. We&rsquo;ll send return instructions and a shipping label
            where applicable.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Refund timing</h2>
          <p className="mt-3">
            Once we receive and inspect your return, we&rsquo;ll process your refund to the original payment
            method. Refunds typically appear within 5&ndash;10 business days, depending on your bank or card
            issuer.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Order cancellations</h2>
          <p className="mt-3">
            If you need to cancel an order, contact us as soon as possible. We can cancel orders that haven&rsquo;t
            shipped yet at no charge; once an order has shipped, it falls under the standard return process above.
          </p>
        </section>
      </div>
    </main>
  );
}
