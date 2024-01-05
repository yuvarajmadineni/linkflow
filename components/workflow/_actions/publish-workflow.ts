"use server";

import { db } from "@/lib/db";
import { workflows } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function publishWorkflow(workflowId: string) {
  const [updatedWorkflow] = await db
    .update(workflows)
    .set({ status: "published" })
    .where(eq(workflows.id, workflowId))
    .returning();

  revalidatePath(`/workflow/${workflowId}`);

  return updatedWorkflow;
}
