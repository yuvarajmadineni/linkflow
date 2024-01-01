import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  timestamp,
  varchar,
  primaryKey,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { Edge, Node } from "reactflow";
import { getInitialWorkflow } from "./utils";
import { ElementInstance } from "@/components/workflow/workflow-components";

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
  status: text("status"),
  phoneNumber: varchar("phone_number", { length: 256 }),
  organizationId: uuid("organization_id").references(() => organization.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  status: text("status").default("inactive"),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userToGroups = pgTable(
  "user_to_groups",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    groupId: uuid("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.groupId, t.userId] }),
  })
);

export const workflowStatusEnum = pgEnum("status", [
  "published",
  "archived",
  "draft",
]);

type WorkflowBuildConfig = {
  nodes: Node[];
  edges: Edge[];
};

const { initialNodes, initialEdges } = getInitialWorkflow();

export const workflows = pgTable("workflows", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  instructions: text("instructions").notNull(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  status: workflowStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  buildConfig: jsonb("build_config")
    .$type<WorkflowBuildConfig>()
    .default({ nodes: initialNodes, edges: initialEdges }),
});

export const pageNode = pgTable("pagenode", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  title: text("title"),
  elements: jsonb("elements").$type<ElementInstance[]>().default([]),
  workflowId: uuid("workflow_id")
    .notNull()
    .references(() => workflows.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const branchNode = pgTable("branchnode", {
  id: uuid("id").primaryKey(),
  title: text("title"),

  workflowId: uuid("workflow_id")
    .notNull()
    .references(() => workflows.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const condition = pgTable("condition", {
  id: uuid("id").primaryKey().defaultRandom(),
  branchNodeId: uuid("branch_node_id")
    .notNull()
    .references(() => branchNode.id, { onDelete: "cascade" }),
  lhs: text("lhs"),
  rhs: text("rhs"),
  operator: text("operator"),
  edgeId: uuid("edge_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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

export const workflowOrgRelations = relations(workflows, ({ one }) => ({
  organization: one(organization, {
    fields: [workflows.organizationId],
    references: [organization.id],
  }),
}));

export const orgWorkflowRelations = relations(organization, ({ many }) => ({
  workflows: many(workflows),
}));
