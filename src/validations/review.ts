import * as z from "zod"

const idSchema = z
  .string({
    required_error: "Review ID is required",
    invalid_type_error: "Review ID must be a string",
  })
  .min(1, { message: "Review ID must have at least 1 character" })
  .max(128, { message: "Review ID must have at most 128 characters" })

export const addReviewSchema = z.object({
  bookingId: z
    .string({
      required_error: "Booking ID is required",
      invalid_type_error: "Booking ID must be a string",
    })
    .min(1, { message: "Booking ID must have at least 1 character" })
    .max(128, { message: "Booking ID must have at most 128 characters" }),
  providerId: z
    .string({
      required_error: "Provider ID is required",
      invalid_type_error: "Provider ID must be a string",
    })
    .min(1, { message: "Provider ID must have at least 1 character" })
    .max(128, { message: "Provider ID must have at most 128 characters" }),
  clientId: z
    .string({
      required_error: "Client ID is required",
      invalid_type_error: "Client ID must be a string",
    })
    .min(1, { message: "Client ID must have at least 1 character" })
    .max(128, { message: "Client ID must have at most 128 characters" }),
  rating: z
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .int({ message: "Rating must be an integer" })
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" }),
  comment: z
    .string({ invalid_type_error: "Comment must be a string" })
    .max(4096, { message: "Comment must have at most 4096 characters" })
    .optional(),
  isPublic: z
    .boolean({ invalid_type_error: "isPublic must be a boolean" })
    .optional(),
})

export const updateReviewSchema = z.object({
  id: idSchema,
  rating: z
    .number({ invalid_type_error: "Rating must be a number" })
    .int({ message: "Rating must be an integer" })
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" })
    .optional(),
  comment: z
    .string({ invalid_type_error: "Comment must be a string" })
    .max(4096, { message: "Comment must have at most 4096 characters" })
    .optional(),
  isPublic: z
    .boolean({ invalid_type_error: "isPublic must be a boolean" })
    .optional(),
})

export const getReviewByIdSchema = z.object({
  id: idSchema,
})

export const deleteReviewSchema = z.object({
  id: idSchema,
})

export type AddReviewInput = z.infer<typeof addReviewSchema>
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>
export type GetReviewByIdInput = z.infer<typeof getReviewByIdSchema>
export type DeleteReviewInput = z.infer<typeof deleteReviewSchema>
