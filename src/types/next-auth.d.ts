import type { DefaultSession } from "next-auth"

type Role = "admin" | "provider" | "client"

declare module "next-auth" {
  interface User {
    role: Role
  }

  interface Session {
    user: User & DefaultSession["user"]
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role
  }
}
