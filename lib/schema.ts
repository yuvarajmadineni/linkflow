import { relations } from "drizzle-orm";
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const organization = pgTable("organization", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: text("organization_id").unique(),
  name: text("name"),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(),
  fullName: text("full_name"),
  email: text("email").notNull().unique(),
  imageUrl: text("image_url"),
  role: text("role").notNull().$type<"admin" | "webuser" | "mobileuser">(),
  organizationId: uuid("organization_id").references(() => organization.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const userRelations = relations(users, ({ one }) => ({
  organization: one(organization, {
    fields: [users.organizationId],
    references: [organization.id],
  }),
}));

export const orgRelations = relations(organization, ({ many }) => ({
  users: many(users),
}));
