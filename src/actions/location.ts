"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/config/db"
import {
  psGetAllLocations,
  psGetLocationById,
  psGetActiveLocations,
  psDeleteLocationById,
} from "@/db/prepared-statements/location"
import { locations, type Location } from "@/db/schema"
import { generateId } from "@/lib/utils"
import {
  addLocationSchema,
  updateLocationSchema,
  getLocationByIdSchema,
  deleteLocationSchema,
  type AddLocationInput,
  type UpdateLocationInput,
  type GetLocationByIdInput,
  type DeleteLocationInput,
} from "@/validations/location"

export async function getAllLocations(): Promise<Location[]> {
  try {
    noStore()
    const allLocations = await psGetAllLocations.execute()
    return allLocations
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all locations")
  }
}

export async function getActiveLocations(): Promise<Location[]> {
  try {
    noStore()
    const activeLocations = await psGetActiveLocations.execute()
    return activeLocations
  } catch (error) {
    console.error(error)
    throw new Error("Error getting active locations")
  }
}

export async function getLocationById(
  rawInput: GetLocationByIdInput
): Promise<Location | null> {
  try {
    const validatedInput = getLocationByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [location] = await psGetLocationById.execute({
      id: validatedInput.data.id,
    })
    return location || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting location by id")
  }
}

export async function addLocation(
  rawInput: AddLocationInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = addLocationSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const newLocation = await db
      .insert(locations)
      .values({
        id: generateId(),
        cityName: validatedInput.data.cityName,
        region: validatedInput.data.region,
        isActive: validatedInput.data.isActive,
      })
      .returning()

    revalidatePath("/admin/locations")

    return newLocation ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error adding location")
  }
}

export async function updateLocation(
  rawInput: UpdateLocationInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  try {
    const validatedInput = updateLocationSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const existing = await getLocationById({ id: validatedInput.data.id })
    if (!existing) return "not-found"

    const updatedLocation = await db
      .update(locations)
      .set({
        cityName: validatedInput.data.cityName,
        region: validatedInput.data.region,
        isActive: validatedInput.data.isActive,
      })
      .where(eq(locations.id, validatedInput.data.id))
      .returning()

    revalidatePath("/admin/locations")

    return updatedLocation ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating location")
  }
}

export async function deleteLocation(
  rawInput: DeleteLocationInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = deleteLocationSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const deleted = await psDeleteLocationById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/locations")

    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting location")
  }
}
