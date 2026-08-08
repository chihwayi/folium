import type { Metadata } from "next";

import { SignUpForm } from "../_components/sign-up-form";

export const metadata: Metadata = { title: "Create an account | Folium" };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return <SignUpForm callbackUrl={callbackUrl} />;
}
