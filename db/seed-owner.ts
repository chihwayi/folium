// Creates (or promotes) the initial owner account. Credentials come from env
// vars, never hardcoded, since this script is meant to run against real
// environments (including production, once Sprint 7 lands).
//
//   OWNER_EMAIL=you@example.com OWNER_PASSWORD=... [OWNER_NAME=...] pnpm db:seed-owner
import { eq } from "drizzle-orm";

import { db } from "./index";
import { users } from "./schema";
import { hashPassword } from "../lib/auth/password";

async function seedOwner() {
  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;
  const name = process.env.OWNER_NAME ?? "Owner";

  if (!email || !password) {
    console.error("Set OWNER_EMAIL and OWNER_PASSWORD env vars before running this script.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("OWNER_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase();
  const passwordHash = await hashPassword(password);
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existing) {
    await db
      .update(users)
      .set({ passwordHash, role: "owner", name, updatedAt: new Date() })
      .where(eq(users.id, existing.id));
    console.log(`Updated existing user ${normalizedEmail} to owner.`);
  } else {
    await db.insert(users).values({ email: normalizedEmail, name, passwordHash, role: "owner" });
    console.log(`Created owner account ${normalizedEmail}.`);
  }
}

seedOwner()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
