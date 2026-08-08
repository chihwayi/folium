import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

// Custom rather than Auth.js's built-in verificationTokens table — this
// project uses Credentials + JWT sessions (no adapter), so a small table we
// control directly is simpler than adopting the full adapter schema for one
// use case.
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("password_reset_tokens_user_id_idx").on(table.userId)],
);
