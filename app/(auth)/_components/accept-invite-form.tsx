"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { acceptInvitationAction, type ActionState } from "../actions";

export function AcceptInviteForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(acceptInvitationAction, {});

  if (!token) {
    return <p className="text-sm text-destructive">This invitation link is missing its token.</p>;
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Back office</p>
        <h1 className="mt-1 font-serif text-2xl">Accept your invitation</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Set your name and a password to join Folium&rsquo;s back office.
      </p>
      <input type="hidden" name="token" value={token} />
      {state.error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="name" className="text-xs font-semibold tracking-wide uppercase">
          Name
        </label>
        <Input id="name" name="name" type="text" required autoComplete="name" className="mt-1.5" />
      </div>
      <div>
        <label htmlFor="password" className="text-xs font-semibold tracking-wide uppercase">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1.5"
        />
      </div>
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Joining…" : "Accept invitation"}
      </Button>
    </form>
  );
}
