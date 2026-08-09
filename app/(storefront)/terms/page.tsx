import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service | Folium" };

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <p className="text-xs font-semibold tracking-[.2em] text-primary uppercase">Legal</p>
      <h1 className="mt-2 font-serif text-4xl">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated August 9, 2026.</p>

      <div className="mt-10 space-y-8 leading-7 text-muted-foreground">
        <section>
          <h2 className="font-serif text-xl text-foreground">Using Folium</h2>
          <p className="mt-3">
            By browsing or buying from Folium, you agree to these terms. If you don&rsquo;t agree with them, please
            don&rsquo;t use the site. We may update these terms occasionally; continued use after a change means
            you accept the updated terms.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Accounts</h2>
          <p className="mt-3">
            You&rsquo;re responsible for keeping your account credentials confidential and for all activity under
            your account. Let us know right away if you believe your account has been compromised.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Orders and pricing</h2>
          <p className="mt-3">
            All prices are listed in US dollars and don&rsquo;t include shipping or applicable taxes, which are
            calculated at checkout. We reserve the right to correct pricing errors, cancel orders placed at an
            incorrect price, and limit order quantities. Placing an order is an offer to buy; a contract is formed
            only once we confirm your payment and dispatch your order.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Stock and availability</h2>
          <p className="mt-3">
            We try to keep stock levels accurate, but availability can change between when you add a book to your
            cart and when you check out. If an item you&rsquo;ve ordered turns out to be unavailable, we&rsquo;ll
            contact you and issue a refund for that item.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Reviews and content you submit</h2>
          <p className="mt-3">
            Reviews should be your own honest opinion of a book you&rsquo;ve read. We moderate reviews before they
            appear publicly and may decline or remove ones that are abusive, spam, unrelated to the book, or
            otherwise inappropriate. By submitting a review, you give us permission to display it on Folium.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Intellectual property</h2>
          <p className="mt-3">
            The Folium name, design, and site content (excluding book cover art and metadata, which belong to their
            respective publishers) belong to Folium. You may not copy or reuse them without permission.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Limitation of liability</h2>
          <p className="mt-3">
            Folium is provided as-is. To the extent permitted by law, we aren&rsquo;t liable for indirect or
            consequential losses arising from your use of the site. Nothing in these terms limits any right you
            have under consumer protection law that can&rsquo;t be excluded.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Contact</h2>
          <p className="mt-3">
            Questions about these terms can be sent to{" "}
            <a href="mailto:hello@folium.example" className="text-primary hover:underline">
              hello@folium.example
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
