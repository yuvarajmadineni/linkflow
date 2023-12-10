"use server";

import { ElementInstance } from "@/components/workflow/workflow-components";
import { db } from "@/lib/db";
import { pageNode } from "@/lib/schema";
import { eq } from "drizzle-orm";

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
  return db
    .update(pageNode)
    .set({ name, elements, title, workflowId })
    .where(eq(pageNode.id, nodeId))
    .returning();
}
