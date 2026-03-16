import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { locations } from "@/db/schema"

export const psGetAllLocations = db
  .select()
  .from(locations)
  .prepare("psGetAllLocations")

export const psGetLocationById = db
  .select()
  .from(locations)
  .where(eq(locations.id, sql.placeholder("id")))
  .prepare("psGetLocationById")

export const psGetActiveLocations = db
  .select()
  .from(locations)
  .where(eq(locations.isActive, true))
  .prepare("psGetActiveLocations")

export const psDeleteLocationById = db
  .delete(locations)
  .where(eq(locations.id, sql.placeholder("id")))
  .prepare("psDeleteLocationById")
