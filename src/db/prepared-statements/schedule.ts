import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { providerSchedules } from "@/db/schema"

export const psGetScheduleById = db
  .select()
  .from(providerSchedules)
  .where(eq(providerSchedules.id, sql.placeholder("id")))
  .prepare("psGetScheduleById")

export const psGetSchedulesByProviderId = db
  .select()
  .from(providerSchedules)
  .where(eq(providerSchedules.providerId, sql.placeholder("providerId")))
  .prepare("psGetSchedulesByProviderId")

export const psDeleteScheduleById = db
  .delete(providerSchedules)
  .where(eq(providerSchedules.id, sql.placeholder("id")))
  .prepare("psDeleteScheduleById")
