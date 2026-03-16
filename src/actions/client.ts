"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/config/db"
import {
  psGetAllClients,
  psGetClientById,
  psGetClientByUserId,
  psDeleteClientById,
} from "@/db/prepared-statements/client"
import { clients, type Client } from "@/db/schema"
import { generateId } from "@/lib/utils"
import {
  addClientSchema,
  updateClientSchema,
  getClientByIdSchema,
  getClientByUserIdSchema,
  deleteClientSchema,
  type AddClientInput,
  type UpdateClientInput,
  type GetClientByIdInput,
  type GetClientByUserIdInput,
  type DeleteClientInput,
} from "@/validations/client"

export async function getAllClients(): Promise<Client[]> {
  try {
    noStore()
    const allClients = await psGetAllClients.execute()
    return allClients
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all clients")
  }
}

export async function getClientById(
  rawInput: GetClientByIdInput
): Promise<Client | null> {
  try {
    const validatedInput = getClientByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [client] = await psGetClientById.execute({
      id: validatedInput.data.id,
    })
    return client || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting client by id")
  }
}

export async function getClientByUserId(
  rawInput: GetClientByUserIdInput
): Promise<Client | null> {
  try {
    const validatedInput = getClientByUserIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [client] = await psGetClientByUserId.execute({
      userId: validatedInput.data.userId,
    })
    return client || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting client by user id")
  }
}

export async function addClient(
  rawInput: AddClientInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = addClientSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const newClient = await db
      .insert(clients)
      .values({
        id: generateId(),
        userId: validatedInput.data.userId,
        telegramId: validatedInput.data.telegramId,
        membershipStatus: validatedInput.data.membershipStatus,
        notes: validatedInput.data.notes,
      })
      .returning()

    revalidatePath("/admin/clients")

    return newClient ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error adding client")
  }
}

export async function updateClient(
  rawInput: UpdateClientInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  try {
    const validatedInput = updateClientSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const existing = await getClientById({ id: validatedInput.data.id })
    if (!existing) return "not-found"

    const updatedClient = await db
      .update(clients)
      .set({
        telegramId: validatedInput.data.telegramId,
        membershipStatus: validatedInput.data.membershipStatus,
        notes: validatedInput.data.notes,
      })
      .where(eq(clients.id, validatedInput.data.id))
      .returning()

    revalidatePath("/admin/clients")

    return updatedClient ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating client")
  }
}

export async function deleteClient(
  rawInput: DeleteClientInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = deleteClientSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const deleted = await psDeleteClientById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/clients")

    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting client")
  }
}
