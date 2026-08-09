import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy | Folium" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <p className="text-xs font-semibold tracking-[.2em] text-primary uppercase">Legal</p>
      <h1 className="mt-2 font-serif text-4xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated August 9, 2026.</p>

      <div className="mt-10 space-y-8 leading-7 text-muted-foreground">
        <section>
          <h2 className="font-serif text-xl text-foreground">What we collect</h2>
          <p className="mt-3">
            When you browse Folium, we don&rsquo;t collect anything beyond what&rsquo;s needed to show you the
            catalog and remember your cart. When you create an account, we store your name, email address, and a
            securely hashed password &mdash; never your password in plain text. When you place an order, we collect
            your shipping address and the email address you provide at checkout, whether or not you have an
            account.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Payment information</h2>
          <p className="mt-3">
            Folium never sees or stores your card details. Payment is handled entirely by Stripe, our payment
            processor. We receive confirmation that a payment succeeded and the amount, nothing more.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">How we use your information</h2>
          <p className="mt-3">We use the information we collect to:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Fulfill and ship your orders, and send order confirmations and updates</li>
            <li>Maintain your account, cart, wishlist, and order history</li>
            <li>Respond to support requests</li>
            <li>Improve the catalog and storefront based on aggregate, non-identifying usage patterns</li>
          </ul>
          <p className="mt-3">We do not sell your personal information to anyone.</p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Who we share it with</h2>
          <p className="mt-3">
            We share the minimum necessary information with the services that make Folium work: Stripe (payments),
            Resend (order and account emails), and Cloudflare R2 (storing book cover images we host). Each of these
            providers is bound by its own privacy and security obligations. We don&rsquo;t share your data with
            anyone else.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Cookies</h2>
          <p className="mt-3">
            We use a single essential cookie to remember your cart if you&rsquo;re not signed in, and a session
            cookie to keep you signed in. Neither is used for advertising or cross-site tracking.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Your choices</h2>
          <p className="mt-3">
            You can review and update your account details at any time from your account page. To request a copy of
            your data, or to have your account and associated personal data deleted, contact us using the details
            below.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl text-foreground">Contact</h2>
          <p className="mt-3">
            Questions about this policy or your data can be sent to{" "}
            <a href="mailto:privacy@folium.example" className="text-primary hover:underline">
              privacy@folium.example
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
