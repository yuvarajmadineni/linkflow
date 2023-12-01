import { db } from "@/lib/db";
import { getUserProfile } from "@/lib/organization";
import { users } from "@/lib/schema";
import { and, eq, like, notInArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const userProfile = await getUserProfile();

  if (!userProfile || !userProfile.organizationId) {
    return new NextResponse("Unauthorised", { status: 401 });
  }

  const allUsers = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.organizationId, userProfile.organizationId),
        notInArray(users.status, ["deactivated", "suspended"]),
        like(users.fullName, `%${search}%`)
      )
    )
    .then((payload) => payload.filter((user) => !user.role?.includes("admin")));

  return NextResponse.json({ success: true, data: allUsers });
}
