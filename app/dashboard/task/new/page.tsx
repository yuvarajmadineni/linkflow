import { getAllUsers, getWorkflows } from "@/lib/organization";
import { ChevronRight } from "lucide-react";
import { Pipeline } from "./pipeline";

export default async function NewPipeline() {
  const workflows = await getWorkflows();
  const users = await getAllUsers("");
  return (
    <div className="px-8 py-6 flex flex-col gap-4 h-full">
      <div className="flex gap-4">
        <p className="text-muted-foreground">Task pipeline</p>
        <ChevronRight className="text-muted-foreground" />
        <p>New pipeline</p>
      </div>
      <Pipeline users={users} workflows={workflows} />
    </div>
  );
}
