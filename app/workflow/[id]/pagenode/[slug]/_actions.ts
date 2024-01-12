"use server";

import { ElementInstance } from "@/components/workflow/workflow-components";
import { db } from "@/lib/db";
import { condition, pageNode } from "@/lib/schema";
import { eq, notInArray, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function savePageNodeProperties({
  name,
  elements,
  title,
  workflowId,
  nodeId,
}: {
  name: string;
  elements: ElementInstance[];
  title: string;
  workflowId: string;
  nodeId: string;
}) {
  const variables = elements
    .filter((el) => !!el.extraAttributes?.value)
    .map((el) => el.extraAttributes?.value);

  await db.transaction(async (tx) => {
    await tx
      .update(pageNode)
      .set({ name, elements, title, workflowId })
      .where(eq(pageNode.id, nodeId));

    if (variables.length)
      await tx
        .update(condition)
        .set({ lhs: "", rhs: "", operator: "" })
        .where(notInArray(condition.lhs, variables));
  });

  revalidatePath(`/workflow/${workflowId}/pagenode/${nodeId}`);
}
