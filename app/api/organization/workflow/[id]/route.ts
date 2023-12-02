import { db } from "@/lib/db";
import { workflows } from "@/lib/schema";
import { eq, param } from "drizzle-orm";
import { z } from "zod";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const { status } = body;

  const statusSchema = z.enum(["published", "draft", "archived"]);

  const verifiedStatus = statusSchema.parse(status);

  const [updatedWorkflow] = await db
    .update(workflows)
    .set({ status: verifiedStatus })
    .where(eq(workflows.id, params.id));

  return Response.json({ success: true, data: updatedWorkflow });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const [workflow] = await db
    .select()
    .from(workflows)
    .where(eq(workflows.id, params.id));

  if (!workflow) {
    return new Response("Workflow does not exist", { status: 404 });
  }

  const [deletedWorkflow] = await db
    .delete(workflows)
    .where(eq(workflows.id, params.id))
    .returning();

  return Response.json({ success: true, data: deletedWorkflow });
}
