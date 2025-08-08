import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  doublePrecision,
  uuid,
  pgSchema,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const authSchema = pgSchema("auth");

const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
});
