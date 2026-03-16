import NextAuth from "next-auth"

import authConfig from "@/config/auth"
import {
  DEFAULT_SIGNIN_REDIRECT,
  DEFAULT_UNAUTHENTICATED_REDIRECT,
} from "@/config/defaults"

const { auth } = NextAuth(authConfig)

export const authRoutes = ["/login", "/register", "/error"]
export const publicRoutes = [
  "/",
  "/book",
  "/register/verify-email",
  "/register/resend-verification",
  "/login/reset-password",
  "/login/update-password",
]

export default auth((req) => {
  const authenticated = !!req.auth
  const pathname = req.nextUrl.pathname
  const isApiAuthRoute = pathname.startsWith("/api/auth")
  const isApiRoute = pathname.startsWith("/api/")
  const isAuthRoute = authRoutes.includes(pathname)
  const isPublicRoute =
    publicRoutes.includes(pathname) || pathname.startsWith("/book/")

  if (isApiAuthRoute) return null
  if (isApiRoute) return null

  if (isAuthRoute) {
    if (authenticated) {
      return Response.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, req.nextUrl))
    }
    return null
  }

  if (!authenticated && !isPublicRoute) {
    return Response.redirect(
      new URL(DEFAULT_UNAUTHENTICATED_REDIRECT, req.nextUrl)
    )
  }

  return null
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
