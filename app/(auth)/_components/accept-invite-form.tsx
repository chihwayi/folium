"use client";

import { useActionState } from "react";

import { acceptInvitationAction, type ActionState } from "../actions";

const inputClass = "mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm";

export function AcceptInviteForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(acceptInvitationAction, {});

  if (!token) {
    return <p className="text-sm text-destructive">This invitation link is missing its token.</p>;
  }

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="font-serif text-2xl">Accept your invitation</h1>
      <p className="text-sm text-muted-foreground">
        Set your name and a password to join Folium&rsquo;s back office.
      </p>
      <input type="hidden" name="token" value={token} />
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div>
        <label htmlFor="name" className="text-xs font-semibold tracking-wide uppercase">
          Name
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className="text-xs font-semibold tracking-wide uppercase">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-10 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Joining…" : "Accept invitation"}
      </button>
    </form>
  );
}
