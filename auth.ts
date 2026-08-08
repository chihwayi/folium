import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, parsed.data.email.toLowerCase()))
          .limit(1);
        if (!user?.passwordHash) return null;

        const valid = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
});
