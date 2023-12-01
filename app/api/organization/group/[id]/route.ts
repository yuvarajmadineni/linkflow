import { db } from "@/lib/db";
import { groups, userToGroups, users } from "@/lib/schema";
import { Group, User } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return new NextResponse("BAD REQUEST", { status: 400 });
  }
  const group = await db
    .select()
    .from(groups)
    .where(eq(groups.id, params.id))
    .leftJoin(userToGroups, eq(userToGroups.groupId, groups.id))
    .leftJoin(users, eq(users.id, userToGroups.userId))
    .then((payload) => {
      let groupWithUsers: { group: Group; users: User[] } = {
        group: payload[0]?.groups,
        users: payload[0]?.users ? [payload[0].users] : [],
      };
      for (let i = 1; i < payload.length; i++) {
        const groupUsers = payload[i];
        groupUsers.users && groupWithUsers.users.push(groupUsers.users);
      }

      return groupWithUsers;
    });

  if (!group) {
    return new NextResponse("Group does not exist", { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: group,
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { status, name, description } = body;
  const users = body.users as User[];
  if (!params.id) {
    return new NextResponse("BAD REQUEST", { status: 400 });
  }

  const statusSchema = z.enum(["suspended", "deactivated"]);

  const statusCheck = statusSchema.safeParse(status);

  let statusValue: z.infer<typeof statusSchema> | null = null;
  if (statusCheck.success) {
    statusValue = statusCheck.data;
  }

  const updateValues: {
    status?: string;
    users?: User[];
    name?: string;
    description?: string;
  } = {
    ...(name ? { name } : {}),
    ...(description ? { description } : {}),
    ...(statusValue ? { statusValue } : {}),
  };

  const [group] = await db
    .select()
    .from(groups)
    .where(eq(groups.id, params.id));

  if (!group) {
    return new NextResponse("Group does not exist", { status: 404 });
  }

  if (group.status === updateValues.status) {
    return new NextResponse(`Group already has status of  ${status}`, {
      status: 400,
    });
  }

  try {
    const group = await db.transaction(async (tx) => {
      const [updatedGroup] = await tx
        .update(groups)
        .set(updateValues)
        .where(eq(groups.id, params.id))
        .returning();
      if (users) {
        const updateUsers = users.map((user) => ({
          userId: user.id,
          groupId: params.id,
        }));
        await tx
          .delete(userToGroups)
          .where(eq(userToGroups.groupId, params.id));
        if (users.length > 0) await tx.insert(userToGroups).values(updateUsers);
      }
      return updatedGroup;
    });

    return NextResponse.json({ success: true, data: group });
  } catch (e) {
    return new NextResponse("Error while updating group", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return new NextResponse("Group id is required", { status: 400 });
  }

  const [group] = await db
    .select()
    .from(groups)
    .where(eq(groups.id, params.id));

  if (!group) {
    return new NextResponse("Group does not exist", { status: 404 });
  }

  const [deletedGroup] = await db
    .delete(groups)
    .where(eq(groups.id, params.id))
    .returning();

  return NextResponse.json({ success: true, data: deletedGroup });
}
