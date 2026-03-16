import * as z from "zod"

const idSchema = z
  .string({
    required_error: "Service ID is required",
    invalid_type_error: "Service ID must be a string",
  })
  .min(1, { message: "Service ID must have at least 1 character" })
  .max(128, { message: "Service ID must have at most 128 characters" })

export const addServiceSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(1, { message: "Name must have at least 1 character" })
    .max(128, { message: "Name must have at most 128 characters" }),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .max(1024, { message: "Description must have at most 1024 characters" })
    .optional(),
  durationMinutes: z
    .number({
      required_error: "Duration in minutes is required",
      invalid_type_error: "Duration must be a number",
    })
    .int({ message: "Duration must be an integer" })
    .positive({ message: "Duration must be a positive number" }),
  basePrice: z
    .string({
      required_error: "Base price is required",
      invalid_type_error: "Base price must be a string",
    })
    .min(1, { message: "Base price is required" })
    .max(16, { message: "Base price must have at most 16 characters" }),
  category: z
    .string({ invalid_type_error: "Category must be a string" })
    .max(64, { message: "Category must have at most 64 characters" })
    .optional(),
})

export const updateServiceSchema = z.object({
  id: idSchema,
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(1, { message: "Name must have at least 1 character" })
    .max(128, { message: "Name must have at most 128 characters" })
    .optional(),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .max(1024, { message: "Description must have at most 1024 characters" })
    .optional(),
  durationMinutes: z
    .number({ invalid_type_error: "Duration must be a number" })
    .int({ message: "Duration must be an integer" })
    .positive({ message: "Duration must be a positive number" })
    .optional(),
  basePrice: z
    .string({ invalid_type_error: "Base price must be a string" })
    .min(1, { message: "Base price is required" })
    .max(16, { message: "Base price must have at most 16 characters" })
    .optional(),
  category: z
    .string({ invalid_type_error: "Category must be a string" })
    .max(64, { message: "Category must have at most 64 characters" })
    .optional(),
})

export const getServiceByIdSchema = z.object({
  id: idSchema,
})

export const deleteServiceSchema = z.object({
  id: idSchema,
})

export type AddServiceInput = z.infer<typeof addServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
export type GetServiceByIdInput = z.infer<typeof getServiceByIdSchema>
export type DeleteServiceInput = z.infer<typeof deleteServiceSchema>
