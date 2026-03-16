import { type AdapterAccount } from "@auth/core/adapters"
import { relations, sql } from "drizzle-orm"
import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

// ============================================================
// Enums
// ============================================================

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "provider",
  "client",
])

export const providerStatusEnum = pgEnum("provider_status", [
  "active",
  "inactive",
  "traveling",
])

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "rejected",
])

export const membershipStatusEnum = pgEnum("membership_status", [
  "unpaid",
  "active",
  "expired",
])

// ============================================================
// NextAuth Tables (DO NOT MODIFY table/column names)
// ============================================================

export const accounts = pgTable(
  "accounts",
  {
    userId: varchar("userId", { length: 512 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 256 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 256 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 512 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 512 }),
    access_token: varchar("access_token", { length: 512 }),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 256 }),
    scope: varchar("scope", { length: 256 }),
    id_token: varchar("id_token", { length: 512 }),
    session_state: varchar("session_state", { length: 256 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessions = pgTable("sessions", {
  sessionToken: varchar("sessionToken", { length: 512 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 512 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: varchar("identifier", { length: 512 }).notNull(),
    token: varchar("token", { length: 512 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({
      columns: [vt.identifier, vt.token],
    }),
  })
)

// ============================================================
// Users
// ============================================================

export const users = pgTable("users", {
  id: varchar("id", { length: 128 }).notNull().primaryKey(),
  role: userRoleEnum("role").notNull().default("client"),
  name: varchar("name", { length: 64 }),
  email: varchar("email", { length: 64 }).unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  emailVerificationToken: varchar("emailVerificationToken", {
    length: 512,
  }).unique(),
  passwordHash: varchar("passwordHash", { length: 256 }),
  resetPasswordToken: varchar("resetPasswordToken", { length: 512 }).unique(),
  resetPasswordTokenExpiry: timestamp("resetPasswordTokenExpires", {
    mode: "date",
  }),
  image: varchar("image", { length: 512 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

export const userRelations = relations(users, ({ one, many }) => ({
  account: one(accounts, {
    fields: [users.id],
    references: [accounts.userId],
  }),
  session: many(sessions),
  provider: one(providers, {
    fields: [users.id],
    references: [providers.userId],
  }),
  client: one(clients, {
    fields: [users.id],
    references: [clients.userId],
  }),
}))

// ============================================================
// Providers
// ============================================================

export const providers = pgTable("providers", {
  id: varchar("id", { length: 128 }).notNull().primaryKey(),
  userId: varchar("user_id", { length: 128 }).references(() => users.id, {
    onDelete: "set null",
  }),
  name: varchar("name", { length: 64 }).notNull(),
  bio: varchar("bio", { length: 1024 }),
  avatarUrl: varchar("avatar_url", { length: 512 }),
  telegramId: varchar("telegram_id", { length: 128 }),
  status: providerStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

export const providerRelations = relations(providers, ({ one, many }) => ({
  user: one(users, {
    fields: [providers.userId],
    references: [users.id],
  }),
  providerServices: many(providerServices),
  schedules: many(providerSchedules),
  bookings: many(bookings),
  reviews: many(reviews),
}))

// ============================================================
// Locations (Cities)
// ============================================================

export const locations = pgTable("locations", {
  id: varchar("id", { length: 128 }).notNull().primaryKey(),
  cityName: varchar("city_name", { length: 64 }).notNull(),
  region: varchar("region", { length: 64 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
})

export const locationRelations = relations(locations, ({ many }) => ({
  schedules: many(providerSchedules),
  bookings: many(bookings),
}))

// ============================================================
// Services
// ============================================================

export const services = pgTable("services", {
  id: varchar("id", { length: 128 }).notNull().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  description: varchar("description", { length: 1024 }),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  basePrice: varchar("base_price", { length: 16 }).notNull(),
  category: varchar("category", { length: 64 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
})

export const serviceRelations = relations(services, ({ many }) => ({
  providerServices: many(providerServices),
  bookings: many(bookings),
}))

// ============================================================
// Provider <-> Service (Many-to-Many)
// ============================================================

export const providerServices = pgTable(
  "provider_services",
  {
    providerId: varchar("provider_id", { length: 128 })
      .notNull()
      .references(() => providers.id, { onDelete: "cascade" }),
    serviceId: varchar("service_id", { length: 128 })
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.providerId, t.serviceId],
    }),
  })
)

export const providerServicesRelations = relations(
  providerServices,
  ({ one }) => ({
    provider: one(providers, {
      fields: [providerServices.providerId],
      references: [providers.id],
    }),
    service: one(services, {
      fields: [providerServices.serviceId],
      references: [services.id],
    }),
  })
)

// ============================================================
// Provider Schedules (which city on which dates)
// ============================================================

export const providerSchedules = pgTable("provider_schedules", {
  id: varchar("id", { length: 128 }).notNull().primaryKey(),
  providerId: varchar("provider_id", { length: 128 })
    .notNull()
    .references(() => providers.id, { onDelete: "cascade" }),
  locationId: varchar("location_id", { length: 128 })
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  dateStart: date("date_start", { mode: "date" }).notNull(),
  dateEnd: date("date_end", { mode: "date" }).notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  notes: varchar("notes", { length: 512 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

export const providerScheduleRelations = relations(
  providerSchedules,
  ({ one }) => ({
    provider: one(providers, {
      fields: [providerSchedules.providerId],
      references: [providers.id],
    }),
    location: one(locations, {
      fields: [providerSchedules.locationId],
      references: [locations.id],
    }),
  })
)

// ============================================================
// Clients
// ============================================================

export const clients = pgTable("clients", {
  id: varchar("id", { length: 128 }).notNull().primaryKey(),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  telegramId: varchar("telegram_id", { length: 128 }),
  membershipStatus: membershipStatusEnum("membership_status")
    .notNull()
    .default("unpaid"),
  membershipPaidAt: timestamp("membership_paid_at", { mode: "date" }),
  preferences: jsonb("preferences").$type<Record<string, unknown>>(),
  notes: varchar("notes", { length: 2048 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

export const clientRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
  reviews: many(reviews),
}))

// ============================================================
// Bookings
// ============================================================

export const bookings = pgTable("bookings", {
  id: varchar("id", { length: 128 }).notNull().primaryKey(),
  clientId: varchar("client_id", { length: 128 }).references(() => clients.id, {
    onDelete: "set null",
  }),
  providerId: varchar("provider_id", { length: 128 })
    .notNull()
    .references(() => providers.id, { onDelete: "cascade" }),
  serviceId: varchar("service_id", { length: 128 })
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  locationId: varchar("location_id", { length: 128 })
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  bookingDate: date("booking_date", { mode: "date" }).notNull(),
  bookingTime: varchar("booking_time", { length: 5 }).notNull(),
  status: bookingStatusEnum("status").notNull().default("pending"),
  totalPrice: varchar("total_price", { length: 16 }),
  notes: varchar("notes", { length: 2048 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

export const bookingRelations = relations(bookings, ({ one, many }) => ({
  client: one(clients, {
    fields: [bookings.clientId],
    references: [clients.id],
  }),
  provider: one(providers, {
    fields: [bookings.providerId],
    references: [providers.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  location: one(locations, {
    fields: [bookings.locationId],
    references: [locations.id],
  }),
  reviews: many(reviews),
}))

// ============================================================
// Reviews
// ============================================================

export const reviews = pgTable("reviews", {
  id: varchar("id", { length: 128 }).notNull().primaryKey(),
  bookingId: varchar("booking_id", { length: 128 })
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  providerId: varchar("provider_id", { length: 128 })
    .notNull()
    .references(() => providers.id, { onDelete: "cascade" }),
  clientId: varchar("client_id", { length: 128 })
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: varchar("comment", { length: 4096 }),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
})

export const reviewRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  provider: one(providers, {
    fields: [reviews.providerId],
    references: [providers.id],
  }),
  client: one(clients, {
    fields: [reviews.clientId],
    references: [clients.id],
  }),
}))

// ============================================================
// Type Exports
// ============================================================

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

export type VerificationToken = typeof verificationTokens.$inferSelect
export type NewVerificationToken = typeof verificationTokens.$inferInsert

export type Provider = typeof providers.$inferSelect
export type NewProvider = typeof providers.$inferInsert

export type Location = typeof locations.$inferSelect
export type NewLocation = typeof locations.$inferInsert

export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert

export type ProviderService = typeof providerServices.$inferSelect
export type NewProviderService = typeof providerServices.$inferInsert

export type ProviderSchedule = typeof providerSchedules.$inferSelect
export type NewProviderSchedule = typeof providerSchedules.$inferInsert

export type Client = typeof clients.$inferSelect
export type NewClient = typeof clients.$inferInsert

export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
