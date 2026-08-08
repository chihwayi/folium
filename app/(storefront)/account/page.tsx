import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PasswordForm } from "./_components/password-form";
import { ProfileForm } from "./_components/profile-form";

export const metadata: Metadata = { title: "Your account | Folium" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/account");

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="font-serif text-4xl">Your account</h1>
      <div className="mt-8 space-y-6">
        <ProfileForm name={session.user.name ?? ""} email={session.user.email ?? ""} />
        <PasswordForm />
      </div>
    </main>
  );
}
