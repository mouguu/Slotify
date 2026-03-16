"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"

import { db } from "@/config/db"
import {
  psGetAllBookings,
  psGetBookingById,
  psGetBookingsByProviderId,
  psGetBookingsByClientId,
  psDeleteBookingById,
} from "@/db/prepared-statements/booking"
import { bookings, type Booking } from "@/db/schema"
import { generateId } from "@/lib/utils"
import {
  addBookingSchema,
  updateBookingSchema,
  getBookingByIdSchema,
  deleteBookingSchema,
  type AddBookingInput,
  type UpdateBookingInput,
  type GetBookingByIdInput,
  type DeleteBookingInput,
} from "@/validations/booking"

export async function getAllBookings(): Promise<Booking[]> {
  try {
    noStore()
    const allBookings = await psGetAllBookings.execute()
    return allBookings
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all bookings")
  }
}

export async function getBookingById(
  rawInput: GetBookingByIdInput
): Promise<Booking | null> {
  try {
    const validatedInput = getBookingByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [booking] = await psGetBookingById.execute({
      id: validatedInput.data.id,
    })
    return booking || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting booking by id")
  }
}

export async function getBookingsByProvider(
  providerId: string
): Promise<Booking[]> {
  try {
    noStore()
    const providerBookings = await psGetBookingsByProviderId.execute({
      providerId,
    })
    return providerBookings
  } catch (error) {
    console.error(error)
    throw new Error("Error getting bookings by provider")
  }
}

export async function getBookingsByClient(
  clientId: string
): Promise<Booking[]> {
  try {
    noStore()
    const clientBookings = await psGetBookingsByClientId.execute({
      clientId,
    })
    return clientBookings
  } catch (error) {
    console.error(error)
    throw new Error("Error getting bookings by client")
  }
}

export async function addBooking(
  rawInput: AddBookingInput
): Promise<"invalid-input" | "conflict" | "error" | "success"> {
  try {
    const validatedInput = addBookingSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const bookingDate = new Date(validatedInput.data.bookingDate)

    // Check if the provider already has a booking at the same date+time
    const conflicting = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.providerId, validatedInput.data.providerId),
          eq(bookings.bookingDate, bookingDate),
          eq(bookings.bookingTime, validatedInput.data.bookingTime)
        )
      )

    if (conflicting.length > 0) return "conflict"

    const newBooking = await db
      .insert(bookings)
      .values({
        id: generateId(),
        clientId: validatedInput.data.clientId,
        providerId: validatedInput.data.providerId,
        serviceId: validatedInput.data.serviceId,
        locationId: validatedInput.data.locationId,
        bookingDate: bookingDate,
        bookingTime: validatedInput.data.bookingTime,
        totalPrice: validatedInput.data.totalPrice,
        notes: validatedInput.data.notes,
      })
      .returning()

    revalidatePath("/admin/bookings")

    return newBooking ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error adding booking")
  }
}

export async function updateBooking(
  rawInput: UpdateBookingInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  try {
    const validatedInput = updateBookingSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const existing = await getBookingById({ id: validatedInput.data.id })
    if (!existing) return "not-found"

    const updatedBooking = await db
      .update(bookings)
      .set({
        status: validatedInput.data.status,
        notes: validatedInput.data.notes,
        totalPrice: validatedInput.data.totalPrice,
      })
      .where(eq(bookings.id, validatedInput.data.id))
      .returning()

    revalidatePath("/admin/bookings")

    return updatedBooking ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating booking")
  }
}

export async function deleteBooking(
  rawInput: DeleteBookingInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = deleteBookingSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const deleted = await psDeleteBookingById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/bookings")

    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting booking")
  }
}
