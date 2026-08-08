import type { Metadata } from "next";

import { ResetPasswordForm } from "../_components/reset-password-form";

export const metadata: Metadata = { title: "Set a new password | Folium" };

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/reset-password">) {
  const { token } = await searchParams;
  const tokenValue = Array.isArray(token) ? token[0] : token;

  if (!tokenValue) {
    return (
      <div className="space-y-2">
        <h1 className="font-serif text-2xl">Invalid link</h1>
        <p className="text-sm text-muted-foreground">
          This password reset link is missing its token. Request a new one from the sign-in page.
        </p>
      </div>
    );
  }

  return <ResetPasswordForm token={tokenValue} />;
}
