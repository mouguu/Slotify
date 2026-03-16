"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { and, eq, lte, gte, ne } from "drizzle-orm"

import { db } from "@/config/db"
import {
  psGetScheduleById,
  psGetSchedulesByProviderId,
  psDeleteScheduleById,
} from "@/db/prepared-statements/schedule"
import {
  providerSchedules,
  providers,
  type ProviderSchedule,
  type Provider,
} from "@/db/schema"
import { generateId } from "@/lib/utils"
import {
  addScheduleSchema,
  updateScheduleSchema,
  getScheduleByIdSchema,
  deleteScheduleSchema,
  getSchedulesByProviderSchema,
  type AddScheduleInput,
  type UpdateScheduleInput,
  type GetScheduleByIdInput,
  type DeleteScheduleInput,
  type GetSchedulesByProviderInput,
} from "@/validations/schedule"

export async function getSchedulesByProvider(
  rawInput: GetSchedulesByProviderInput
): Promise<ProviderSchedule[]> {
  try {
    const validatedInput = getSchedulesByProviderSchema.safeParse(rawInput)
    if (!validatedInput.success) return []

    noStore()
    const schedules = await psGetSchedulesByProviderId.execute({
      providerId: validatedInput.data.providerId,
    })
    return schedules
  } catch (error) {
    console.error(error)
    throw new Error("Error getting schedules by provider")
  }
}

export async function getScheduleById(
  rawInput: GetScheduleByIdInput
): Promise<ProviderSchedule | null> {
  try {
    const validatedInput = getScheduleByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [schedule] = await psGetScheduleById.execute({
      id: validatedInput.data.id,
    })
    return schedule || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting schedule by id")
  }
}

export async function addSchedule(
  rawInput: AddScheduleInput
): Promise<"invalid-input" | "overlap" | "error" | "success"> {
  try {
    const validatedInput = addScheduleSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const newDateStart = new Date(validatedInput.data.dateStart)
    const newDateEnd = new Date(validatedInput.data.dateEnd)

    // Check for overlap with existing schedules for the same provider
    const overlapping = await db
      .select()
      .from(providerSchedules)
      .where(
        and(
          eq(providerSchedules.providerId, validatedInput.data.providerId),
          lte(providerSchedules.dateStart, newDateEnd),
          gte(providerSchedules.dateEnd, newDateStart)
        )
      )

    if (overlapping.length > 0) return "overlap"

    const newSchedule = await db
      .insert(providerSchedules)
      .values({
        id: generateId(),
        providerId: validatedInput.data.providerId,
        locationId: validatedInput.data.locationId,
        dateStart: newDateStart,
        dateEnd: newDateEnd,
        isAvailable: validatedInput.data.isAvailable,
        notes: validatedInput.data.notes,
      })
      .returning()

    revalidatePath("/admin/calendar")

    return newSchedule ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error adding schedule")
  }
}

export async function updateSchedule(
  rawInput: UpdateScheduleInput
): Promise<"invalid-input" | "not-found" | "overlap" | "error" | "success"> {
  try {
    const validatedInput = updateScheduleSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const existing = await getScheduleById({ id: validatedInput.data.id })
    if (!existing) return "not-found"

    const dateStart = validatedInput.data.dateStart
      ? new Date(validatedInput.data.dateStart)
      : existing.dateStart
    const dateEnd = validatedInput.data.dateEnd
      ? new Date(validatedInput.data.dateEnd)
      : existing.dateEnd
    const providerId = validatedInput.data.providerId ?? existing.providerId

    // Check for overlap excluding the schedule being updated
    const overlapping = await db
      .select()
      .from(providerSchedules)
      .where(
        and(
          eq(providerSchedules.providerId, providerId),
          ne(providerSchedules.id, validatedInput.data.id),
          lte(providerSchedules.dateStart, dateEnd),
          gte(providerSchedules.dateEnd, dateStart)
        )
      )

    if (overlapping.length > 0) return "overlap"

    const updatedSchedule = await db
      .update(providerSchedules)
      .set({
        providerId: validatedInput.data.providerId,
        locationId: validatedInput.data.locationId,
        dateStart: validatedInput.data.dateStart
          ? new Date(validatedInput.data.dateStart)
          : undefined,
        dateEnd: validatedInput.data.dateEnd
          ? new Date(validatedInput.data.dateEnd)
          : undefined,
        isAvailable: validatedInput.data.isAvailable,
        notes: validatedInput.data.notes,
      })
      .where(eq(providerSchedules.id, validatedInput.data.id))
      .returning()

    revalidatePath("/admin/calendar")

    return updatedSchedule ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating schedule")
  }
}

export async function deleteSchedule(
  rawInput: DeleteScheduleInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = deleteScheduleSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const deleted = await psDeleteScheduleById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/calendar")

    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting schedule")
  }
}

export async function getAvailableProvidersByLocationAndDate(
  locationId: string,
  date: string
): Promise<Provider[]> {
  try {
    noStore()
    const targetDate = new Date(date)

    const matchingSchedules = await db
      .select({
        provider: providers,
      })
      .from(providerSchedules)
      .innerJoin(providers, eq(providerSchedules.providerId, providers.id))
      .where(
        and(
          eq(providerSchedules.locationId, locationId),
          lte(providerSchedules.dateStart, targetDate),
          gte(providerSchedules.dateEnd, targetDate),
          eq(providerSchedules.isAvailable, true)
        )
      )

    return matchingSchedules.map((row) => row.provider)
  } catch (error) {
    console.error(error)
    throw new Error("Error getting available providers by location and date")
  }
}
