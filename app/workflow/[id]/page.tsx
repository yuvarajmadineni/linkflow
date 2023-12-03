import Logo from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getWorkflowById } from "@/lib/organization";
import { ChevronLeft, Redo, Rocket, Undo, Verified } from "lucide-react";
import { EditWorkflow } from "./edit-workflow";

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
      <section className="bg-gray-200 dark:bg-gray-700 py-2 px-4 w-full flex justify-between items-center">
        <div className="flex gap-4">
          <ChevronLeft />
          <h2 className="text-base">{workflow.name}</h2>
          <Badge variant={variant}>
            {workflow.status.at(0)?.toUpperCase() + workflow.status.slice(1)}
          </Badge>
        </div>
        <div className="flex gap-8 px-4 items-center">
          <Verified className="h-7 w-7 fill-primary stroke-secondary" />
          <div className="flex gap-4 items-center">
            <div className="flex gap-4">
              <Undo />
              <Redo />
            </div>
            <Button variant="secondary">
              <Rocket className="h-5 w-5 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </section>
      <EditWorkflow workflow={workflow} />
    </div>
  );
}
