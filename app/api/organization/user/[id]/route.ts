import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { status } = body;
  if (!params.id || !status) {
    return new NextResponse("BAD REQUEST", { status: 400 });
  }

  const statusSchema = z.enum(["suspended", "deactivated"]);

  const statusCheck = statusSchema.safeParse(status);

  if (!statusCheck.success) {
    return new NextResponse("Invalid Status value", { status: 400 });
  }

  const verifiedStatus = statusCheck.data;

  const [user] = await db.select().from(users).where(eq(users.id, params.id));

  if (!user) {
    return new NextResponse("User does not exist", { status: 404 });
  }

  if (user.status === (verifiedStatus as any)) {
    return new NextResponse(`User already ${status}`, { status: 400 });
  }

  const [updatedUser] = await db
    .update(users)
    .set({ status: verifiedStatus as any })
    .where(eq(users.id, params.id))
    .returning();

  return NextResponse.json({ success: true, data: updatedUser });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return new NextResponse("Userid is required", { status: 400 });
  }

  const [user] = await db.select().from(users).where(eq(users.id, params.id));

  if (!user) {
    return new NextResponse("User does not exist", { status: 404 });
  }

  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, params.id))
    .returning();

  return NextResponse.json({ success: true, data: deletedUser });
}
