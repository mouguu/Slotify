import * as z from "zod"

import { bookings } from "@/db/schema"

const idSchema = z
  .string({
    required_error: "Booking ID is required",
    invalid_type_error: "Booking ID must be a string",
  })
  .min(1, { message: "Booking ID must have at least 1 character" })
  .max(128, { message: "Booking ID must have at most 128 characters" })

export const addBookingSchema = z.object({
  clientId: z
    .string({
      invalid_type_error: "Client ID must be a string",
    })
    .max(128, { message: "Client ID must have at most 128 characters" })
    .optional(),
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
  locationId: z
    .string({
      required_error: "Location ID is required",
      invalid_type_error: "Location ID must be a string",
    })
    .min(1, { message: "Location ID must have at least 1 character" })
    .max(128, { message: "Location ID must have at most 128 characters" }),
  bookingDate: z
    .string({
      required_error: "Booking date is required",
      invalid_type_error: "Booking date must be a string",
    })
    .min(1, { message: "Booking date is required" }),
  bookingTime: z
    .string({
      required_error: "Booking time is required",
      invalid_type_error: "Booking time must be a string",
    })
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
      message: "Booking time must be in HH:mm format",
    }),
  totalPrice: z
    .string({ invalid_type_error: "Total price must be a string" })
    .max(16, { message: "Total price must have at most 16 characters" })
    .optional(),
  notes: z
    .string({ invalid_type_error: "Notes must be a string" })
    .max(2048, { message: "Notes must have at most 2048 characters" })
    .optional(),
})

export const updateBookingSchema = z.object({
  id: idSchema,
  status: z
    .enum(bookings.status.enumValues, {
      invalid_type_error: "Status must be one of the predefined values",
    })
    .optional(),
  notes: z
    .string({ invalid_type_error: "Notes must be a string" })
    .max(2048, { message: "Notes must have at most 2048 characters" })
    .optional(),
  totalPrice: z
    .string({ invalid_type_error: "Total price must be a string" })
    .max(16, { message: "Total price must have at most 16 characters" })
    .optional(),
})

export const getBookingByIdSchema = z.object({
  id: idSchema,
})

export const deleteBookingSchema = z.object({
  id: idSchema,
})

export const filterBookingsSchema = z.object({
  status: z
    .enum(bookings.status.enumValues, {
      invalid_type_error: "Status must be one of the predefined values",
    })
    .optional(),
  providerId: z
    .string({ invalid_type_error: "Provider ID must be a string" })
    .optional(),
  locationId: z
    .string({ invalid_type_error: "Location ID must be a string" })
    .optional(),
  clientId: z
    .string({ invalid_type_error: "Client ID must be a string" })
    .optional(),
  dateFrom: z
    .string({ invalid_type_error: "Date from must be a string" })
    .optional(),
  dateTo: z
    .string({ invalid_type_error: "Date to must be a string" })
    .optional(),
})

export type AddBookingInput = z.infer<typeof addBookingSchema>
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>
export type GetBookingByIdInput = z.infer<typeof getBookingByIdSchema>
export type DeleteBookingInput = z.infer<typeof deleteBookingSchema>
export type FilterBookingsInput = z.infer<typeof filterBookingsSchema>
