import { and, eq } from "drizzle-orm"

import { db } from "@/config/db"
import { providerSchedules, bookings } from "@/db/schema"

/**
 * Get available time slots for a provider at a specific location on a given date.
 *
 * Checks that the provider is scheduled at the location on that date,
 * gets all existing bookings for the provider on that date,
 * generates 30-minute interval slots from 09:00 to 22:00,
 * and filters out slots that conflict with existing bookings.
 */
export async function getAvailableTimeSlots(
  providerId: string,
  locationId: string,
  date: Date,
  serviceDurationMinutes: number
): Promise<string[]> {
  try {
    // Check provider is scheduled at the location on that date
    const schedules = await db
      .select()
      .from(providerSchedules)
      .where(
        and(
          eq(providerSchedules.providerId, providerId),
          eq(providerSchedules.locationId, locationId),
          eq(providerSchedules.isAvailable, true)
        )
      )

    // Filter schedules where the date falls within dateStart..dateEnd
    const matchingSchedule = schedules.find((schedule) => {
      const start = new Date(schedule.dateStart)
      const end = new Date(schedule.dateEnd)
      const target = new Date(date)
      start.setHours(0, 0, 0, 0)
      end.setHours(0, 0, 0, 0)
      target.setHours(0, 0, 0, 0)
      return target >= start && target <= end
    })

    if (!matchingSchedule) return []

    // Get all existing bookings for that provider on that date
    const existingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.providerId, providerId),
          eq(bookings.bookingDate, date)
        )
      )

    const bookedTimes = existingBookings.map((b) => b.bookingTime)

    // Generate all possible 30-minute interval time slots from 09:00 to 22:00
    const startHour = 9
    const endHour = 22
    const intervalMinutes = 30
    const allSlots: string[] = []

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += intervalMinutes) {
        const timeStr = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`
        allSlots.push(timeStr)
      }
    }

    // Filter out slots that conflict with existing bookings considering service duration
    const availableSlots = allSlots.filter((slot) => {
      const [slotHour, slotMin] = slot.split(":").map(Number)
      const slotStartMinutes = (slotHour ?? 0) * 60 + (slotMin ?? 0)
      const slotEndMinutes = slotStartMinutes + serviceDurationMinutes

      // Ensure the slot + service duration does not exceed the end hour
      if (slotEndMinutes > endHour * 60) return false

      // Check against each booked time
      for (const bookedTime of bookedTimes) {
        const [bookedHour, bookedMin] = bookedTime.split(":").map(Number)
        const bookedStartMinutes = (bookedHour ?? 0) * 60 + (bookedMin ?? 0)
        // Assume existing bookings also occupy at least serviceDurationMinutes
        const bookedEndMinutes = bookedStartMinutes + serviceDurationMinutes

        // Check for overlap: slot overlaps if it starts before booked ends
        // and ends after booked starts
        if (
          slotStartMinutes < bookedEndMinutes &&
          slotEndMinutes > bookedStartMinutes
        ) {
          return false
        }
      }

      return true
    })

    return availableSlots
  } catch (error) {
    console.error(error)
    throw new Error("Error getting available time slots")
  }
}
