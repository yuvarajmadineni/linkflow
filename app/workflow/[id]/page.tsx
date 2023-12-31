import Logo from "@/components/logo";
import { getWorkflowById } from "@/lib/organization";
import { WorkflowChanges } from "../../../components/workflow/workflow-changes";

export default async function WorkflowEditor({
  params,
}: {
  params: { id: string };
}) {
  const { workflow, pageNodes } = await getWorkflowById(params.id);
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
      <WorkflowChanges workflow={workflow} pageNodes={pageNodes} />
    </div>
  );
}
