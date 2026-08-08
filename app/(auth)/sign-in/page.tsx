import type { Metadata } from "next";

import { SignInForm } from "../_components/sign-in-form";

export const metadata: Metadata = { title: "Sign in | Folium" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return <SignInForm callbackUrl={callbackUrl} />;
}
