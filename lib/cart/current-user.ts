import "server-only";

/**
 * Sprint 1 owns session resolution. Keeping this seam isolated lets its Auth.js
 * helper replace this guest-only fallback without coupling cart code to auth internals.
 */
export async function getCurrentUserId(): Promise<string | null> {
  return null;
}
