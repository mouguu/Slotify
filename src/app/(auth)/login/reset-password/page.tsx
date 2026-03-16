import { type Metadata } from "next"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PasswordResetForm } from "@/components/forms/auth/password-reset-form"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL),
  title: "Reset Password",
  description: "Enter your email to receive a password reset link",
}

export default function PasswordResetPage(): JSX.Element {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card className="bg-background max-sm:flex max-sm:h-screen max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            A reset link will be sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <PasswordResetForm />
          <Link
            aria-label="Go back to sign in"
            href="/login"
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
