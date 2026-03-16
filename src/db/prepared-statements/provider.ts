import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { providers } from "@/db/schema"

export const psGetAllProviders = db
  .select()
  .from(providers)
  .prepare("psGetAllProviders")

export const psGetProviderById = db
  .select()
  .from(providers)
  .where(eq(providers.id, sql.placeholder("id")))
  .prepare("psGetProviderById")

export const psDeleteProviderById = db
  .delete(providers)
  .where(eq(providers.id, sql.placeholder("id")))
  .prepare("psDeleteProviderById")
