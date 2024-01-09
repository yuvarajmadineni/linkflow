import { getAllUsers, getTaskById, getWorkflows } from "@/lib/organization";
import { ChevronRight } from "lucide-react";
import { Pipeline } from "../new/pipeline";

export default async function EditPipeline({
  params,
}: {
  params: { slug: string };
}) {
  const [workflows, users, task] = await Promise.all([
    getWorkflows(),
    getAllUsers(""),
    getTaskById(params.slug),
  ]);

  return (
    <div className="px-8 py-6 flex flex-col gap-4 h-full">
      <div className="flex gap-4">
        <p className="text-muted-foreground">Task pipeline</p>
        <ChevronRight className="text-muted-foreground" />
        <p>New pipeline</p>
      </div>
      <Pipeline users={users} workflows={workflows} task={task[0]} />
    </div>
  );
}
