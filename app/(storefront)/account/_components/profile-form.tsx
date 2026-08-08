"use client";

import { useActionState } from "react";

import { updateAccountAction, type ActionState } from "@/app/(auth)/actions";

const inputClass = "mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateAccountAction, {});

  return (
    <form action={formAction} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="font-serif text-xl">Profile</h2>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">Profile updated.</p>}
      <div>
        <label htmlFor="name" className="text-xs font-semibold tracking-wide uppercase">
          Name
        </label>
        <input id="name" name="name" type="text" required defaultValue={name} className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="text-xs font-semibold tracking-wide uppercase">
          Email
        </label>
        <input id="email" name="email" type="email" required defaultValue={email} className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
