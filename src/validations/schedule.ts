import * as z from "zod"

const idSchema = z
  .string({
    required_error: "Schedule ID is required",
    invalid_type_error: "Schedule ID must be a string",
  })
  .min(1, { message: "Schedule ID must have at least 1 character" })
  .max(128, { message: "Schedule ID must have at most 128 characters" })

const providerIdSchema = z
  .string({
    required_error: "Provider ID is required",
    invalid_type_error: "Provider ID must be a string",
  })
  .min(1, { message: "Provider ID must have at least 1 character" })
  .max(128, { message: "Provider ID must have at most 128 characters" })

const locationIdSchema = z
  .string({
    required_error: "Location ID is required",
    invalid_type_error: "Location ID must be a string",
  })
  .min(1, { message: "Location ID must have at least 1 character" })
  .max(128, { message: "Location ID must have at most 128 characters" })

const dateStringSchema = z
  .string({
    required_error: "Date is required",
    invalid_type_error: "Date must be a string",
  })
  .min(1, { message: "Date is required" })

export const addScheduleSchema = z.object({
  providerId: providerIdSchema,
  locationId: locationIdSchema,
  dateStart: dateStringSchema,
  dateEnd: dateStringSchema,
  isAvailable: z
    .boolean({ invalid_type_error: "isAvailable must be a boolean" })
    .optional(),
  notes: z
    .string({ invalid_type_error: "Notes must be a string" })
    .max(512, { message: "Notes must have at most 512 characters" })
    .optional(),
})

export const updateScheduleSchema = z.object({
  id: idSchema,
  providerId: providerIdSchema.optional(),
  locationId: locationIdSchema.optional(),
  dateStart: dateStringSchema.optional(),
  dateEnd: dateStringSchema.optional(),
  isAvailable: z
    .boolean({ invalid_type_error: "isAvailable must be a boolean" })
    .optional(),
  notes: z
    .string({ invalid_type_error: "Notes must be a string" })
    .max(512, { message: "Notes must have at most 512 characters" })
    .optional(),
})

export const getScheduleByIdSchema = z.object({
  id: idSchema,
})

export const deleteScheduleSchema = z.object({
  id: idSchema,
})

export const getSchedulesByProviderSchema = z.object({
  providerId: providerIdSchema,
})

export const getSchedulesByLocationAndDateSchema = z.object({
  locationId: locationIdSchema,
  date: z
    .string({
      required_error: "Date is required",
      invalid_type_error: "Date must be a string",
    })
    .min(1, { message: "Date is required" }),
})

export type AddScheduleInput = z.infer<typeof addScheduleSchema>
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>
export type GetScheduleByIdInput = z.infer<typeof getScheduleByIdSchema>
export type DeleteScheduleInput = z.infer<typeof deleteScheduleSchema>
export type GetSchedulesByProviderInput = z.infer<
  typeof getSchedulesByProviderSchema
>
export type GetSchedulesByLocationAndDateInput = z.infer<
  typeof getSchedulesByLocationAndDateSchema
>
