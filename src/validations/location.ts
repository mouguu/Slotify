import * as z from "zod"

const idSchema = z
  .string({
    required_error: "Location ID is required",
    invalid_type_error: "Location ID must be a string",
  })
  .min(1, { message: "Location ID must have at least 1 character" })
  .max(128, { message: "Location ID must have at most 128 characters" })

export const addLocationSchema = z.object({
  cityName: z
    .string({
      required_error: "City name is required",
      invalid_type_error: "City name must be a string",
    })
    .min(1, { message: "City name must have at least 1 character" })
    .max(64, { message: "City name must have at most 64 characters" }),
  region: z
    .string({ invalid_type_error: "Region must be a string" })
    .max(64, { message: "Region must have at most 64 characters" })
    .optional(),
  isActive: z
    .boolean({ invalid_type_error: "isActive must be a boolean" })
    .optional(),
})

export const updateLocationSchema = z.object({
  id: idSchema,
  cityName: z
    .string({ invalid_type_error: "City name must be a string" })
    .min(1, { message: "City name must have at least 1 character" })
    .max(64, { message: "City name must have at most 64 characters" })
    .optional(),
  region: z
    .string({ invalid_type_error: "Region must be a string" })
    .max(64, { message: "Region must have at most 64 characters" })
    .optional(),
  isActive: z
    .boolean({ invalid_type_error: "isActive must be a boolean" })
    .optional(),
})

export const getLocationByIdSchema = z.object({
  id: idSchema,
})

export const deleteLocationSchema = z.object({
  id: idSchema,
})

export type AddLocationInput = z.infer<typeof addLocationSchema>
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>
export type GetLocationByIdInput = z.infer<typeof getLocationByIdSchema>
export type DeleteLocationInput = z.infer<typeof deleteLocationSchema>
