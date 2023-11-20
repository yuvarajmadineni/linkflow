import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { role, status, id, email, phoneNumber, name } = body;

  if (!id) {
    return new NextResponse("BAD REQUEST", { status: 400 });
  }

  const member = await db
    .insert(users)
    .values({ userId: id, email, role, status, phoneNumber, fullName: name })
    .returning();

  return NextResponse.json(member);
}
