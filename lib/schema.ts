import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  timestamp,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";

export const organization = pgTable("organization", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: text("organization_id").unique(),
  name: text("name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(),
  fullName: text("full_name"),
  email: text("email").notNull().unique(),
  imageUrl: text("image_url"),
  role: text("role")
    .array()
    .default(["mobileuser"])
    .$type<Array<"admin" | "webuser" | "mobileuser">>(),
  status: text("status").$type<"accepted | pending | revoked">(),
  phoneNumber: varchar("phone_number", { length: 256 }),
  organizationId: uuid("organization_id").references(() => organization.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userToGroups = pgTable(
  "user_to_groups",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    groupId: uuid("group_id")
      .notNull()
      .references(() => groups.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
  // TODO  composite key creation is failing with this currently , check once the issue is resolved from the drizzle-orm
  // (t) => ({
  //   pk: primaryKey({ columns: [t.groupId, t.userId] }),
  //   pkWithCustomName: primaryKey({
  //     name: "custom_name",
  //     columns: [t.groupId, t.userId],
  //   }),
  // })
);

export const userRelations = relations(users, ({ one }) => ({
  organization: one(organization, {
    fields: [users.organizationId],
    references: [organization.id],
  }),
}));

export const orgRelations = relations(organization, ({ many }) => ({
  users: many(users),
}));

export const usersGroupsRelations = relations(users, ({ many }) => ({
  userToGroups: many(userToGroups),
}));

export const groupUsersRelations = relations(groups, ({ many }) => ({
  userToGroups: many(userToGroups),
}));

export const groupOrgRelations = relations(groups, ({ one }) => ({
  organization: one(organization, {
    fields: [groups.organizationId],
    references: [organization.id],
  }),
}));

export const orgGroupRelations = relations(organization, ({ many }) => ({
  groups: many(groups),
}));
