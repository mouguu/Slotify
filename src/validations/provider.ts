import * as z from "zod"

import { providers } from "@/db/schema"

const idSchema = z
  .string({
    required_error: "Provider ID is required",
    invalid_type_error: "Provider ID must be a string",
  })
  .min(1, { message: "Provider ID must have at least 1 character" })
  .max(128, { message: "Provider ID must have at most 128 characters" })

export const addProviderSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, { message: "Name must have at least 1 character" })
    .max(64, { message: "Name must have at most 64 characters" }),
  bio: z
    .string({ invalid_type_error: "Bio must be a string" })
    .max(1024, { message: "Bio must have at most 1024 characters" })
    .optional(),
  avatarUrl: z
    .string({ invalid_type_error: "Avatar URL must be a string" })
    .max(512, { message: "Avatar URL must have at most 512 characters" })
    .optional(),
  telegramId: z
    .string({ invalid_type_error: "Telegram ID must be a string" })
    .max(128, { message: "Telegram ID must have at most 128 characters" })
    .optional(),
  status: z
    .enum(providers.status.enumValues, {
      invalid_type_error: "Status must be one of the predefined values",
    })
    .optional(),
})

export const updateProviderSchema = z.object({
  id: idSchema,
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(1, { message: "Name must have at least 1 character" })
    .max(64, { message: "Name must have at most 64 characters" })
    .optional(),
  bio: z
    .string({ invalid_type_error: "Bio must be a string" })
    .max(1024, { message: "Bio must have at most 1024 characters" })
    .optional(),
  avatarUrl: z
    .string({ invalid_type_error: "Avatar URL must be a string" })
    .max(512, { message: "Avatar URL must have at most 512 characters" })
    .optional(),
  telegramId: z
    .string({ invalid_type_error: "Telegram ID must be a string" })
    .max(128, { message: "Telegram ID must have at most 128 characters" })
    .optional(),
  status: z
    .enum(providers.status.enumValues, {
      invalid_type_error: "Status must be one of the predefined values",
    })
    .optional(),
})

export const getProviderByIdSchema = z.object({
  id: idSchema,
})

export const deleteProviderSchema = z.object({
  id: idSchema,
})

export const assignServiceToProviderSchema = z.object({
  providerId: z
    .string({
      required_error: "Provider ID is required",
      invalid_type_error: "Provider ID must be a string",
    })
    .min(1, { message: "Provider ID must have at least 1 character" })
    .max(128, { message: "Provider ID must have at most 128 characters" }),
  serviceId: z
    .string({
      required_error: "Service ID is required",
      invalid_type_error: "Service ID must be a string",
    })
    .min(1, { message: "Service ID must have at least 1 character" })
    .max(128, { message: "Service ID must have at most 128 characters" }),
})

export type AddProviderInput = z.infer<typeof addProviderSchema>
export type UpdateProviderInput = z.infer<typeof updateProviderSchema>
export type GetProviderByIdInput = z.infer<typeof getProviderByIdSchema>
export type DeleteProviderInput = z.infer<typeof deleteProviderSchema>
export type AssignServiceToProviderInput = z.infer<
  typeof assignServiceToProviderSchema
>
