import { db } from "@/lib/db";
import { getOrganization } from "@/lib/organization";
import { groups, userToGroups } from "@/lib/schema";
import { User } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  const body = await req.json();

  const schema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().min(1),
    organizationId: z.string(),
  });

  const users = body.users as User[];

  const group = schema.safeParse(body);

  if (!group.success) {
    console.log("error", group.error.errors);
    return new NextResponse("BAD REQUEST", {
      status: 400,
    });
  }

  const data = group.data;
  const org = await getOrganization(data.organizationId);

  if (!org) {
    return new NextResponse("Organization doesnot exist", { status: 400 });
  }

  try {
    const { name, description } = data;
    const newGroup = await db.transaction(async (tx) => {
      const group = await tx
        .insert(groups)
        .values({ name, description, organizationId: org.id })
        .returning();
      const groupUsers = users.map((user) => ({
        userId: user.id,
        groupId: group[0].id,
      }));
      await tx.insert(userToGroups).values(groupUsers);
      return group;
    });

    return NextResponse.json(newGroup[0]);
  } catch (e) {
    console.log("Error while creating group", e);
    return new NextResponse("Error while creating new group", {
      status: 500,
    });
  }
}
