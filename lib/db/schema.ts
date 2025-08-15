import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  doublePrecision,
  uuid,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { authUsers } from "drizzle-orm/supabase";

// Accounts table that extends auth.users with additional fields
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull().default("editor"), // admin/editor
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Main schema for the application
export const offices = pgTable("offices", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  arr: integer("arr").notNull(), // Arrondissement
  priceCents: integer("price_cents").notNull(),
  nbPosts: integer("nb_posts"),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  isFake: boolean("is_fake").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  officeId: integer("office_id")
    .notNull()
    .references(() => offices.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 500 }).notNull(),
  alt: varchar("alt", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  officeId: integer("office_id")
    .notNull()
    .references(() => offices.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  message: text("message"),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, contacted, converted, rejected
  emailVerifiedAt: timestamp("email_verified_at"), // Email verification timestamp
  emailVerificationToken: varchar("email_verification_token", { length: 255 }), // Verification token
  utmJson: jsonb("utm_json"), // UTM parameters and tracking data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  icon: varchar("icon", { length: 100 }), // Icon identifier (e.g., lucide-react icon name)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const officeServices = pgTable("office_services", {
  id: serial("id").primaryKey(),
  officeId: integer("office_id")
    .notNull()
    .references(() => offices.id, { onDelete: "cascade" }),
  serviceId: integer("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  actorId: integer("actor_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(), // create, update, delete, etc.
  targetTable: varchar("target_table", { length: 50 }).notNull(), // offices, leads, etc.
  targetId: integer("target_id"), // ID of the affected record
  meta: jsonb("meta"), // Additional metadata about the action
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const officesRelations = relations(offices, ({ many }) => ({
  photos: many(photos),
  leads: many(leads),
  officeServices: many(officeServices),
}));

export const photosRelations = relations(photos, ({ one }) => ({
  office: one(offices, {
    fields: [photos.officeId],
    references: [offices.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  office: one(offices, {
    fields: [leads.officeId],
    references: [offices.id],
  }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  officeServices: many(officeServices),
}));

export const officeServicesRelations = relations(officeServices, ({ one }) => ({
  office: one(offices, {
    fields: [officeServices.officeId],
    references: [offices.id],
  }),
  service: one(services, {
    fields: [officeServices.serviceId],
    references: [services.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(authUsers, {
    fields: [accounts.userId],
    references: [authUsers.id],
  }),
  auditLogs: many(auditLog),
}));

export const authUsersRelations = relations(authUsers, ({ many }) => ({
  accounts: many(accounts),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  actor: one(accounts, {
    fields: [auditLog.actorId],
    references: [accounts.id],
  }),
}));

// Types for TypeScript
export type AuthUser = typeof authUsers.$inferSelect;
export type NewAuthUser = typeof authUsers.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Office = typeof offices.$inferSelect;
export type NewOffice = typeof offices.$inferInsert;

export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export type OfficeService = typeof officeServices.$inferSelect;
export type NewOfficeService = typeof officeServices.$inferInsert;

export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;
