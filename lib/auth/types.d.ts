import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "customer" | "staff" | "owner";
    } & DefaultSession["user"];
  }

  interface User {
    role: "customer" | "staff" | "owner";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "customer" | "staff" | "owner";
  }
}
