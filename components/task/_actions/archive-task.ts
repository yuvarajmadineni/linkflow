"use server";

import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function archiveTask(taskId: string, status = "archived") {
  await db
    .update(tasks)
    .set({ status: "archived" })
    .where(eq(tasks.id, taskId));
  revalidatePath("/dashboard/task");
}
