import Logo from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getWorkflowById } from "@/lib/organization";
import { ChevronLeft, Redo, Rocket, Undo, Verified } from "lucide-react";
import { EditWorkflow } from "./edit-workflow";
import { WorkflowChanges } from "./Changes";
import { ReactFlowProvider } from "reactflow";

export default async function WorkflowEditor({
  params,
}: {
  params: { id: string };
}) {
  const workflow = await getWorkflowById(params.id);
  let variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "suspend" = "success";
  if (workflow.status === "draft") {
    variant = "default";
  }

  if (workflow.status === "archived") {
    variant = "suspend";
  }
  return (
    <div>
      <nav className="bg-secondary py-4 px-4 w-full flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Logo />
          <h1 className="text-2xl font-semibold">Linkflow</h1>
        </div>
        <div className="flex gap-3 px-4 items-center">
          <ul className="flex gap-6 text-sm">
            <li>Variables</li>
            <li>Settings</li>
            <li>Version history</li>
          </ul>
        </div>
      </nav>
      <WorkflowChanges workflow={workflow} />
    </div>
  );
}
