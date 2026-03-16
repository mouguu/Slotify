"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/config/db"
import {
  psGetAllReviews,
  psGetReviewById,
  psGetReviewsByProviderId,
  psDeleteReviewById,
} from "@/db/prepared-statements/review"
import { reviews, type Review } from "@/db/schema"
import { generateId } from "@/lib/utils"
import {
  addReviewSchema,
  updateReviewSchema,
  getReviewByIdSchema,
  deleteReviewSchema,
  type AddReviewInput,
  type UpdateReviewInput,
  type GetReviewByIdInput,
  type DeleteReviewInput,
} from "@/validations/review"

export async function getAllReviews(): Promise<Review[]> {
  try {
    noStore()
    const allReviews = await psGetAllReviews.execute()
    return allReviews
  } catch (error) {
    console.error(error)
    throw new Error("Error getting all reviews")
  }
}

export async function getReviewById(
  rawInput: GetReviewByIdInput
): Promise<Review | null> {
  try {
    const validatedInput = getReviewByIdSchema.safeParse(rawInput)
    if (!validatedInput.success) return null

    noStore()
    const [review] = await psGetReviewById.execute({
      id: validatedInput.data.id,
    })
    return review || null
  } catch (error) {
    console.error(error)
    throw new Error("Error getting review by id")
  }
}

export async function getReviewsByProvider(
  providerId: string
): Promise<Review[]> {
  try {
    noStore()
    const providerReviews = await psGetReviewsByProviderId.execute({
      providerId,
    })
    return providerReviews
  } catch (error) {
    console.error(error)
    throw new Error("Error getting reviews by provider")
  }
}

export async function addReview(
  rawInput: AddReviewInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = addReviewSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const newReview = await db
      .insert(reviews)
      .values({
        id: generateId(),
        bookingId: validatedInput.data.bookingId,
        providerId: validatedInput.data.providerId,
        clientId: validatedInput.data.clientId,
        rating: validatedInput.data.rating,
        comment: validatedInput.data.comment,
        isPublic: validatedInput.data.isPublic,
      })
      .returning()

    revalidatePath("/admin/reviews")

    return newReview ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error adding review")
  }
}

export async function updateReview(
  rawInput: UpdateReviewInput
): Promise<"invalid-input" | "not-found" | "error" | "success"> {
  try {
    const validatedInput = updateReviewSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const existing = await getReviewById({ id: validatedInput.data.id })
    if (!existing) return "not-found"

    const updatedReview = await db
      .update(reviews)
      .set({
        rating: validatedInput.data.rating,
        comment: validatedInput.data.comment,
        isPublic: validatedInput.data.isPublic,
      })
      .where(eq(reviews.id, validatedInput.data.id))
      .returning()

    revalidatePath("/admin/reviews")

    return updatedReview ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating review")
  }
}

export async function deleteReview(
  rawInput: DeleteReviewInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = deleteReviewSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const deleted = await psDeleteReviewById.execute({
      id: validatedInput.data.id,
    })

    revalidatePath("/admin/reviews")

    return deleted ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error deleting review")
  }
}
