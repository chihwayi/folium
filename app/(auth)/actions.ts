"use server";

import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { auth, signIn, signOut } from "@/auth";
import { db } from "@/db";
import { passwordResetTokens, staffInvitations, users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { generateResetToken, hashToken } from "@/lib/auth/tokens";
import {
  acceptInvitationSchema,
  accountSettingsSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  safeCallbackUrl,
  signInSchema,
  signUpSchema,
} from "@/lib/auth/validation";
import { sendPasswordResetEmail } from "@/lib/email/password-reset";

export type ActionState = { error?: string; success?: boolean };

export async function signUpAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const callbackUrl = safeCallbackUrl(formData.get("callbackUrl"));

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);
  if (existing) return { error: "An account with this email already exists." };

  const passwordHash = await hashPassword(parsed.data.password);
  await db
    .insert(users)
    .values({ name: parsed.data.name, email: parsed.data.email, passwordHash, role: "customer" });

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: callbackUrl,
  });
  return {};
}

export async function signInAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const callbackUrl = safeCallbackUrl(formData.get("callbackUrl"));

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Incorrect email or password." };
    throw error;
  }
  return {};
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function forgotPasswordAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);

  // Always report success, even for unknown emails, so this endpoint can't
  // be used to enumerate which addresses have accounts.
  if (user) {
    const { token, tokenHash } = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await db.insert(passwordResetTokens).values({ userId: user.id, tokenHash, expiresAt });
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(parsed.data.email, resetUrl);
  }

  return { success: true };
}

export async function resetPasswordAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const tokenHash = hashToken(parsed.data.token);
  const [record] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.tokenHash, tokenHash))
    .limit(1);

  if (!record || record.expiresAt < new Date()) {
    return { error: "This reset link is invalid or has expired." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, record.userId));
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, record.id));

  redirect("/sign-in");
}

export async function updateAccountAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { error: "You need to sign in first." };

  const parsed = accountSettingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);
  if (existing && existing.id !== session.user.id) return { error: "That email is already in use." };

  await db
    .update(users)
    .set({ name: parsed.data.name, email: parsed.data.email, updatedAt: new Date() })
    .where(eq(users.id, session.user.id));
  return { success: true };
}

export async function changePasswordAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { error: "You need to sign in first." };

  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!user?.passwordHash || !(await verifyPassword(parsed.data.currentPassword, user.passwordHash))) {
    return { error: "Current password is incorrect." };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, session.user.id));
  return { success: true };
}

export async function acceptInvitationAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = acceptInvitationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const tokenHash = hashToken(parsed.data.token);
  const [invitation] = await db
    .select()
    .from(staffInvitations)
    .where(eq(staffInvitations.tokenHash, tokenHash))
    .limit(1);

  if (!invitation || invitation.acceptedAt || invitation.expiresAt < new Date()) {
    return { error: "This invitation is invalid, already used, or has expired." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, invitation.email))
      .limit(1);

    if (existing) {
      await tx
        .update(users)
        .set({ name: parsed.data.name, passwordHash, role: invitation.role, updatedAt: new Date() })
        .where(eq(users.id, existing.id));
    } else {
      await tx
        .insert(users)
        .values({ name: parsed.data.name, email: invitation.email, passwordHash, role: invitation.role });
    }

    await tx
      .update(staffInvitations)
      .set({ acceptedAt: new Date(), updatedAt: new Date() })
      .where(eq(staffInvitations.id, invitation.id));
  });

  await signIn("credentials", {
    email: invitation.email,
    password: parsed.data.password,
    redirectTo: "/admin",
  });
  return {};
}
