"use server";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveTask({
  workflowId,
  userId,
  taskId,
}: {
  workflowId: string;
  taskId: string;
  userId: string;
}) {
  await db
    .update(tasks)
    .set({ workflowId, userId })
    .where(eq(tasks.id, taskId));
  revalidatePath("/dashboard/task");
  redirect("/dashboard/task");
}
