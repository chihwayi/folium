import { z } from "zod";

// Only allow same-app relative paths as a post-auth redirect target — a
// value like "https://evil.example" or "//evil.example" (protocol-relative)
// would send an authenticated user off-site.
export function safeCallbackUrl(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const accountSettingsSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(1),
  name: z.string().trim().min(1, "Name is required").max(100),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
