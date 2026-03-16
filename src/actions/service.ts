"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/config/db"
import {
  psGetAllServices,
  psGetServiceById,
  psGetActiveServices,
  psDeleteServiceById,
} from "@/db/prepared-statements/service"
import { services, type Service } from "@/db/schema"
import { generateId } from "@/lib/utils"
import {
  addServiceSchema,
  updateServiceSchema,
  getServiceByIdSchema,
  deleteServiceSchema,
  type AddServiceInput,
  type UpdateServiceInput,
  type GetServiceByIdInput,
  type DeleteServiceInput,
} from "@/validations/service"

export async function getAllServices(): Promise<Service[]> {
  try {
    noStore()
    const allServices = await psGetAllServices.execute()
    return allServices
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all services")
  }
}

export async function getActiveServices(): Promise<Service[]> {
  try {
    noStore()
    const activeServices = await psGetActiveServices.execute()
    return activeServices
  } catch (error) {
    console.error(error)
    throw new Error("Error getting active services")
  }
}

export async function getServiceById(
  rawInput: GetServiceByIdInput
): Promise<Service | null> {
  try {
    const validatedInput = getServiceByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [service] = await psGetServiceById.execute({
      id: validatedInput.data.id,
    })
    return service || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting service by id")
  }
}

export async function addService(
  rawInput: AddServiceInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = addServiceSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const newService = await db
      .insert(services)
      .values({
        id: generateId(),
        name: validatedInput.data.name,
        description: validatedInput.data.description,
        durationMinutes: validatedInput.data.durationMinutes,
        basePrice: validatedInput.data.basePrice,
        category: validatedInput.data.category,
      })
      .returning()

    revalidatePath("/admin/services")

    return newService ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error adding service")
  }
}

export async function updateService(
  rawInput: UpdateServiceInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  try {
    const validatedInput = updateServiceSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const existing = await getServiceById({ id: validatedInput.data.id })
    if (!existing) return "not-found"

    const updatedService = await db
      .update(services)
      .set({
        name: validatedInput.data.name,
        description: validatedInput.data.description,
        durationMinutes: validatedInput.data.durationMinutes,
        basePrice: validatedInput.data.basePrice,
        category: validatedInput.data.category,
      })
      .where(eq(services.id, validatedInput.data.id))
      .returning()

    revalidatePath("/admin/services")

    return updatedService ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating service")
  }
}

export async function deleteService(
  rawInput: DeleteServiceInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = deleteServiceSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const deleted = await psDeleteServiceById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/services")

    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting service")
  }
}
