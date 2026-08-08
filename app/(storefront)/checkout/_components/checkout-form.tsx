"use client";

import { useActionState } from "react";
import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "../actions";

export function CheckoutForm() {
  const [state, formAction, pending] = useActionState(createCheckoutSession, null);

  return (
    <form action={formAction} className="mt-7">
      <label htmlFor="email" className="text-sm font-medium">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="reader@example.com"
        className="mt-2 h-11 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
      />
      <label htmlFor="promoCode" className="mt-5 block text-sm font-medium">
        Promo code{" "}
        <span className="font-normal text-muted-foreground">(optional)</span>
      </label>
      <input
        id="promoCode"
        name="promoCode"
        autoComplete="off"
        maxLength={32}
        placeholder="READMORE"
        className="mt-2 h-11 w-full rounded-md border bg-background px-3 uppercase outline-none focus:ring-2 focus:ring-ring"
      />
      {state?.error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button size="lg" className="mt-5 w-full" disabled={pending}>
        <LockKeyhole /> {pending ? "Preparing checkout…" : "Continue to secure payment"}
      </Button>
    </form>
  );
}
