import { auth, currentUser } from "@clerk/nextjs";
import { and, eq, like } from "drizzle-orm";
import { db } from "./db";
import {
  branchNode,
  condition,
  groups,
  organization,
  pageNode,
  tasks,
  userToGroups,
  users,
  workflows,
} from "./schema";
import { Group, PageNode, User, Workflow } from "./utils";

export const createOrganization = async (
  organizationId: string,
  name?: string | null
) => {
  const newOrg = await db
    .insert(organization)
    .values({ organizationId: organizationId, name: name })
    .returning();

  return newOrg[0];
};

export const getOrganization = async (organizationId: string) => {
  return db.query.organization.findFirst({
    where: eq(organization.organizationId, organizationId),
  });
};

export const getUserProfile = async () => {
  const userInfo = await currentUser();

  let profile = await db.query.users.findFirst({
    where: eq(users.email, userInfo?.emailAddresses?.[0].emailAddress!),
  });

  if (profile?.userId !== userInfo?.id) {
    [profile] = await db
      .update(users)
      .set({ userId: userInfo?.id })
      .where(eq(users.id, profile?.id!))
      .returning();
  }

  return profile;
};

export const createorUpdateUserProfile = async (
  role: Array<"admin" | "webuser" | "mobileuser">,
  organizationId?: string
) => {
  const userInfo = await currentUser();

  if (!userInfo) return null;

  const profile = await db.query.users.findFirst({
    where: eq(users.userId, userInfo.id),
  });

  if (profile) {
    const updatedProfile = await db
      .update(users)
      .set({ organizationId })
      .returning();
    return updatedProfile[0];
  }

  const newProfile = await db.insert(users).values({
    userId: userInfo.id,
    fullName: userInfo.firstName,
    organizationId,
    imageUrl: userInfo.imageUrl,
    email: userInfo.emailAddresses[0].emailAddress,
    role,
  });

  return newProfile[0];
};

export const getAllUsers = async (
  search: string,
  role?: "admin" | "mobileuser" | "webuser"
) => {
  const { userId } = auth();

  const user = await db.query.users.findFirst({
    where: eq(users.userId, userId!),
  });

  const allUsers = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.organizationId, user?.organizationId!),
        like(users.fullName, `%${search}%`)
      )
    )
    .then((payload) =>
      payload.filter((user) =>
        role
          ? user.role?.includes(role) && !user.role.includes("admin")
          : !user.role?.includes("admin")
      )
    );

  return allUsers;
};

export const getAllGroups = async (search: string) => {
  const { userId } = auth();

  const user = await db.query.users.findFirst({
    where: eq(users.userId, userId!),
  });

  return db
    .select()
    .from(groups)
    .where(
      and(
        eq(groups.organizationId, user?.organizationId!),
        like(groups.name, `%${search}%`)
      )
    )
    .leftJoin(userToGroups, eq(groups.id, userToGroups.groupId))
    .leftJoin(users, eq(users.id, userToGroups.userId))
    .then((payload) => {
      const mergeGroups: Array<{
        groups: Group | null;
        users: User[];
      }> = [];
      payload.forEach((data) => {
        const group = mergeGroups.find(
          (g) => g.groups?.id === data?.groups?.id
        );
        if (group && data.users) {
          group.users = group.users.concat(data.users);
        } else {
          mergeGroups.push({
            groups: data.groups,
            users: data.users ? [data.users] : [],
          });
        }
      });
      return mergeGroups;
    });
};

export const getWorkflows = async () => {
  const user = await getUserProfile();

  const allWorkflows = await db
    .select()
    .from(workflows)
    .where(eq(workflows.organizationId, user?.organizationId!));

  return allWorkflows;
};

export const getWorkflowById = async (workflowId: string) => {
  let workflow = await db
    .select()
    .from(workflows)
    .where(eq(workflows.id, workflowId))
    .leftJoin(pageNode, eq(pageNode.workflowId, workflowId))
    .then((payload) => {
      const mergedWorkflow: {
        workflow: Workflow;
        pageNodes: PageNode[];
      } = {
        workflow: {} as Workflow,
        pageNodes: [],
      };
      payload.forEach((data) => {
        mergedWorkflow.workflow = data.workflows;
        if (data.pagenode) mergedWorkflow.pageNodes.push(data.pagenode);
      });

      return mergedWorkflow;
    });

  let branchNodeConditions = await db
    .select()
    .from(branchNode)
    .innerJoin(condition, eq(condition.branchNodeId, branchNode.id))
    .where(eq(branchNode.workflowId, workflowId))
    .orderBy(condition.createdAt)
    .then((payload) => payload.map((p) => p.condition));

  return {
    workflow: workflow.workflow,
    pageNodes: workflow.pageNodes,
    conditions: branchNodeConditions,
  };
};

export const getAllTasks = async () => {
  return await db
    .select()
    .from(tasks)
    .innerJoin(workflows, eq(workflows.id, tasks.workflowId))
    .innerJoin(users, eq(users.id, tasks.userId));
};

export const getTaskById = async (id: string) => {
  return db.select().from(tasks).where(eq(tasks.id, id));
};

export const getUserAssignedWorkflows = async () => {
  const user = await getUserProfile();
  return db
    .select()
    .from(tasks)
    .innerJoin(workflows, eq(workflows.id, tasks.workflowId))
    .innerJoin(users, eq(users.id, tasks.userId))
    .where(eq(users.id, user?.id!));
};
