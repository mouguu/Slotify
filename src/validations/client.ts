import * as z from "zod"

import { clients } from "@/db/schema"

const idSchema = z
  .string({
    required_error: "Client ID is required",
    invalid_type_error: "Client ID must be a string",
  })
  .min(1, { message: "Client ID must have at least 1 character" })
  .max(128, { message: "Client ID must have at most 128 characters" })

const userIdSchema = z
  .string({
    required_error: "User ID is required",
    invalid_type_error: "User ID must be a string",
  })
  .min(1, { message: "User ID must have at least 1 character" })
  .max(128, { message: "User ID must have at most 128 characters" })

export const addClientSchema = z.object({
  userId: userIdSchema,
  telegramId: z
    .string({ invalid_type_error: "Telegram ID must be a string" })
    .max(128, { message: "Telegram ID must have at most 128 characters" })
    .optional(),
  membershipStatus: z
    .enum(clients.membershipStatus.enumValues, {
      invalid_type_error:
        "Membership status must be one of the predefined values",
    })
    .optional(),
  notes: z
    .string({ invalid_type_error: "Notes must be a string" })
    .max(2048, { message: "Notes must have at most 2048 characters" })
    .optional(),
})

export const updateClientSchema = z.object({
  id: idSchema,
  telegramId: z
    .string({ invalid_type_error: "Telegram ID must be a string" })
    .max(128, { message: "Telegram ID must have at most 128 characters" })
    .optional(),
  membershipStatus: z
    .enum(clients.membershipStatus.enumValues, {
      invalid_type_error:
        "Membership status must be one of the predefined values",
    })
    .optional(),
  notes: z
    .string({ invalid_type_error: "Notes must be a string" })
    .max(2048, { message: "Notes must have at most 2048 characters" })
    .optional(),
})

export const getClientByIdSchema = z.object({
  id: idSchema,
})

export const getClientByUserIdSchema = z.object({
  userId: userIdSchema,
})

export const deleteClientSchema = z.object({
  id: idSchema,
})

export type AddClientInput = z.infer<typeof addClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
export type GetClientByIdInput = z.infer<typeof getClientByIdSchema>
export type GetClientByUserIdInput = z.infer<typeof getClientByUserIdSchema>
export type DeleteClientInput = z.infer<typeof deleteClientSchema>
