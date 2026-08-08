import type { NextAuthConfig } from "next-auth";

// Split out from auth.ts so middleware (Edge runtime) never has to bundle
// the Credentials provider's authorize() — that needs Node's crypto/scrypt
// and a Postgres connection, neither of which Edge can run. Only
// Edge-safe config (JWT shaping, route authorization) lives here.
export const authConfig = {
  pages: { signIn: "/sign-in" },
  trustHost: true,
  providers: [],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: "customer" | "staff" | "owner" }).role;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.id as string;
      session.user.role = token.role as "customer" | "staff" | "owner";
      return session;
    },
    authorized({ auth, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      if (!isAdminRoute) return true;

      if (!auth?.user) {
        const signInUrl = new URL("/sign-in", request.nextUrl.origin);
        signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return Response.redirect(signInUrl);
      }
      if (auth.user.role !== "staff" && auth.user.role !== "owner") {
        return Response.redirect(new URL("/", request.nextUrl.origin));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
