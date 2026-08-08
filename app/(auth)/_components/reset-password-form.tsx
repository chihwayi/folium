"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordAction, type ActionState } from "../actions";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(resetPasswordAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="font-serif text-2xl">Set a new password</h1>
      {state.error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="password" className="text-xs font-semibold tracking-wide uppercase">
          New password
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
        {pending ? "Saving…" : "Reset password"}
      </Button>
    </form>
  );
}
