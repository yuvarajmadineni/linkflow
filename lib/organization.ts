import { auth, currentUser } from "@clerk/nextjs";
import { db } from "./db";
import { organization, users } from "./schema";
import { and, eq, inArray, like, sql } from "drizzle-orm";
import { User } from "./utils";

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
  const { userId } = auth();

  const profile = await db.query.users.findFirst({
    where: eq(users.userId, userId!),
  });

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
      payload.filter((user) => (role ? user.role?.includes(role) : true))
    );

  return allUsers;
};
