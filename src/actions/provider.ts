"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"

import { db } from "@/config/db"
import {
  psGetAllProviders,
  psGetProviderById,
  psDeleteProviderById,
} from "@/db/prepared-statements/provider"
import { providers, providerServices, services, type Provider, type Service } from "@/db/schema"
import { generateId } from "@/lib/utils"
import {
  addProviderSchema,
  updateProviderSchema,
  getProviderByIdSchema,
  deleteProviderSchema,
  assignServiceToProviderSchema,
  type AddProviderInput,
  type UpdateProviderInput,
  type GetProviderByIdInput,
  type DeleteProviderInput,
  type AssignServiceToProviderInput,
} from "@/validations/provider"

export async function getAllProviders(): Promise<Provider[]> {
  try {
    noStore()
    const allProviders = await psGetAllProviders.execute()
    return allProviders
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all providers")
  }
}

export async function getProviderById(
  rawInput: GetProviderByIdInput
): Promise<Provider | null> {
  try {
    const validatedInput = getProviderByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [provider] = await psGetProviderById.execute({
      id: validatedInput.data.id,
    })
    return provider || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting provider by id")
  }
}

export async function addProvider(
  rawInput: AddProviderInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = addProviderSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const newProvider = await db
      .insert(providers)
      .values({
        id: generateId(),
        name: validatedInput.data.name,
        bio: validatedInput.data.bio,
        avatarUrl: validatedInput.data.avatarUrl,
        telegramId: validatedInput.data.telegramId,
        status: validatedInput.data.status,
      })
      .returning()

    revalidatePath("/admin/providers")

    return newProvider ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error adding provider")
  }
}

export async function updateProvider(
  rawInput: UpdateProviderInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  try {
    const validatedInput = updateProviderSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const existing = await getProviderById({ id: validatedInput.data.id })
    if (!existing) return "not-found"

    const updatedProvider = await db
      .update(providers)
      .set({
        name: validatedInput.data.name,
        bio: validatedInput.data.bio,
        avatarUrl: validatedInput.data.avatarUrl,
        telegramId: validatedInput.data.telegramId,
        status: validatedInput.data.status,
      })
      .where(eq(providers.id, validatedInput.data.id))
      .returning()

    revalidatePath("/admin/providers")

    return updatedProvider ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating provider")
  }
}

export async function deleteProvider(
  rawInput: DeleteProviderInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = deleteProviderSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const deleted = await psDeleteProviderById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/providers")

    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting provider")
  }
}

export async function assignServiceToProvider(
  rawInput: AssignServiceToProviderInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = assignServiceToProviderSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const result = await db
      .insert(providerServices)
      .values({
        providerId: validatedInput.data.providerId,
        serviceId: validatedInput.data.serviceId,
      })
      .returning()

    revalidatePath("/admin/providers")

    return result ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error assigning service to provider")
  }
}

export async function getServicesByProvider(
  providerId: string
): Promise<Service[]> {
  try {
    noStore()
    const rows = await db
      .select({ service: services })
      .from(providerServices)
      .innerJoin(services, eq(providerServices.serviceId, services.id))
      .where(eq(providerServices.providerId, providerId))

    return rows.map((row) => row.service)
  } catch (error) {
    console.error(error)
    throw new Error("Error getting services by provider")
  }
}

export async function removeServiceFromProvider(
  rawInput: AssignServiceToProviderInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = assignServiceToProviderSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const deleted = await db
      .delete(providerServices)
      .where(
        and(
          eq(providerServices.providerId, validatedInput.data.providerId),
          eq(providerServices.serviceId, validatedInput.data.serviceId)
        )
      )
      .returning()

    revalidatePath("/admin/providers")

    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error removing service from provider")
  }
}
