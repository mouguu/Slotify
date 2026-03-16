import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { clients } from "@/db/schema"

export const psGetAllClients = db
  .select()
  .from(clients)
  .prepare("psGetAllClients")

export const psGetClientById = db
  .select()
  .from(clients)
  .where(eq(clients.id, sql.placeholder("id")))
  .prepare("psGetClientById")

export const psGetClientByUserId = db
  .select()
  .from(clients)
  .where(eq(clients.userId, sql.placeholder("userId")))
  .prepare("psGetClientByUserId")

export const psDeleteClientById = db
  .delete(clients)
  .where(eq(clients.id, sql.placeholder("id")))
  .prepare("psDeleteClientById")
