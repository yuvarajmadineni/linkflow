"use server";

import { db } from "@/lib/db";
import { condition } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateCondition({
  conditionId,
  lhs,
  rhs,
  operator,
  workflowId,
}: {
  conditionId: string;
  lhs: string;
  rhs: string;
  operator: string;
  workflowId: string;
}) {
  await db
    .update(condition)
    .set({ lhs, rhs, operator })
    .where(eq(condition.id, conditionId));

  revalidatePath(`/workflow/${workflowId}`);
}
