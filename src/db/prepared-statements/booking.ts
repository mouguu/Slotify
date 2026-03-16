import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { bookings } from "@/db/schema"

export const psGetAllBookings = db
  .select()
  .from(bookings)
  .prepare("psGetAllBookings")

export const psGetBookingById = db
  .select()
  .from(bookings)
  .where(eq(bookings.id, sql.placeholder("id")))
  .prepare("psGetBookingById")

export const psGetBookingsByProviderId = db
  .select()
  .from(bookings)
  .where(eq(bookings.providerId, sql.placeholder("providerId")))
  .prepare("psGetBookingsByProviderId")

export const psGetBookingsByClientId = db
  .select()
  .from(bookings)
  .where(eq(bookings.clientId, sql.placeholder("clientId")))
  .prepare("psGetBookingsByClientId")

export const psDeleteBookingById = db
  .delete(bookings)
  .where(eq(bookings.id, sql.placeholder("id")))
  .prepare("psDeleteBookingById")
