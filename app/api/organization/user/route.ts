import { db } from "@/lib/db";
import { getOrganization } from "@/lib/organization";
import { users } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { role, status, id, email, phoneNumber, name, organizationId } = body;

  if (!id) {
    return new NextResponse("BAD REQUEST", { status: 400 });
  }

  const org = await getOrganization(organizationId);

  const member = await db
    .insert(users)
    .values({
      userId: id,
      email,
      role,
      status,
      phoneNumber,
      fullName: name,
      organizationId: org?.id,
    })
    .returning();

  return NextResponse.json(member);
}
