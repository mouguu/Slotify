import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { reviews } from "@/db/schema"

export const psGetAllReviews = db
  .select()
  .from(reviews)
  .prepare("psGetAllReviews")

export const psGetReviewById = db
  .select()
  .from(reviews)
  .where(eq(reviews.id, sql.placeholder("id")))
  .prepare("psGetReviewById")

export const psGetReviewsByProviderId = db
  .select()
  .from(reviews)
  .where(eq(reviews.providerId, sql.placeholder("providerId")))
  .prepare("psGetReviewsByProviderId")

export const psDeleteReviewById = db
  .delete(reviews)
  .where(eq(reviews.id, sql.placeholder("id")))
  .prepare("psDeleteReviewById")
