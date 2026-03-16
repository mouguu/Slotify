import * as z from "zod"

export const emailSchema = z
  .string({
    required_error: "Email is required",
    invalid_type_error: "Invalid data type",
  })
  .min(5, {
    message: "Email must be at least 5 characters",
  })
  .max(64, {
    message: "Email cannot exceed 64 characters",
  })
  .email({
    message: "Please enter a valid email address",
  })

export const emailVerificationSchema = z.object({
  email: emailSchema,
})

export const markEmailAsVerifiedSchema = z.object({
  token: z.string(),
})

export const checkIfEmailVerifiedSchema = z.object({
  email: emailSchema,
})

export type EmailVerificationFormInput = z.infer<typeof emailVerificationSchema>

export type MarkEmailAsVerifiedInput = z.infer<typeof markEmailAsVerifiedSchema>

export type CheckIfEmailVerifiedInput = z.infer<
  typeof checkIfEmailVerifiedSchema
>
