import { db } from "@/lib/db";
import { getUserProfile } from "@/lib/organization";
import { workflows } from "@/lib/schema";

export async function POST(req: Request) {
  const body = await req.json();

  const { name, instructions, status } = body;

  if (!name || !instructions || !status) {
    return new Response("BAD REQUEST", { status: 400 });
  }

  const userProfile = await getUserProfile();

  if (!userProfile || !userProfile.organizationId) {
    return new Response("Unauthorised", { status: 401 });
  }

  const [newWorkflow] = await db
    .insert(workflows)
    .values({
      name,
      instructions,
      organizationId: userProfile.organizationId,
      status,
    })
    .returning();

  return Response.json({ success: true, data: newWorkflow });
}
