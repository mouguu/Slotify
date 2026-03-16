import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { services } from "@/db/schema"

export const psGetAllServices = db
  .select()
  .from(services)
  .prepare("psGetAllServices")

export const psGetServiceById = db
  .select()
  .from(services)
  .where(eq(services.id, sql.placeholder("id")))
  .prepare("psGetServiceById")

export const psGetActiveServices = db
  .select()
  .from(services)
  .where(eq(services.isActive, true))
  .prepare("psGetActiveServices")

export const psDeleteServiceById = db
  .delete(services)
  .where(eq(services.id, sql.placeholder("id")))
  .prepare("psDeleteServiceById")
