import { PageNodeBuilder } from "@/components/workflow/page-node-builder";
import { Workflowpage } from "@/components/workflowpage";
import { getWorkflowById } from "@/lib/organization";

export default async function StartWorkflow({
  params,
}: {
  params: { id: string };
}) {
  const { workflow, pageNodes } = await getWorkflowById(params.id);

  return (
    <Workflowpage>
      <PageNodeBuilder elements={pageNodes[0].elements!} />
    </Workflowpage>
  );
}
