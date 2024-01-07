"use server";

import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export async function createTask({
  workflowId,
  userId,
  status,
}: {
  workflowId: string;
  userId: string;
  status: "published" | "archived" | "draft";
}) {
  await db.insert(tasks).values({ workflowId, userId, status });
  revalidatePath("/dashboard/task");
}
