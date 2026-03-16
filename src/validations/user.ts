import * as z from "zod"

import { users } from "@/db/schema"
import { passwordSchema, userIdSchema } from "@/validations/auth"
import { emailSchema } from "@/validations/email"

export const userNameSchema = z
  .string({
    invalid_type_error: "Name must be a string",
  })
  .optional()

export const userSchema = z.object({
  name: userNameSchema,
  surname: userNameSchema,
  role: z
    .enum(users.role.enumValues, {
      required_error: "Role is required",
      invalid_type_error: "Role must be one of the predefined values",
    })
    .default("client"),
  email: emailSchema,
  password: passwordSchema.regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
    {
      message:
        "Password must be 8-256 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }
  ),
})

export const getUserByEmailSchema = z.object({
  email: emailSchema,
})

export const getUserByIdSchema = z.object({
  id: userIdSchema,
})

export const getUserByResetPasswordTokenSchema = z.object({
  token: z.string(),
})

export const getUserByEmailVerificationTokenSchema = z.object({
  token: z.string(),
})

export const checkIfUserExistsSchema = z.object({
  id: userIdSchema,
})

export type GetUserByEmailInput = z.infer<typeof getUserByEmailSchema>

export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>

export type GetUserByResetPasswordTokenInput = z.infer<
  typeof getUserByResetPasswordTokenSchema
>

export type GetUserByEmailVerificationTokenInput = z.infer<
  typeof getUserByEmailVerificationTokenSchema
>

export type CheckIfUserExistsInput = z.infer<typeof checkIfUserExistsSchema>
