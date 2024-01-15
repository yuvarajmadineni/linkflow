import { PageNodeBuilder } from "@/components/workflow/page-node-builder";
import { PageNodeSelector } from "@/components/workflow/pagenode-selector";
import { Workflowpage } from "@/components/workflowpage";
import { getWorkflowById } from "@/lib/organization";

export default async function StartWorkflow({
  params,
}: {
  params: { id: string };
}) {
  const { workflow, pageNodes, conditions } = await getWorkflowById(params.id);
  const startNode = workflow.buildConfig?.nodes.find(
    (node) => node.type === "startNode"
  );

  const edge = workflow.buildConfig?.edges.find(
    (edge) => edge.source === startNode?.id
  );

  const initialPageNode = pageNodes.find((n) => n.id === edge?.target);

  if (!startNode || !edge || !initialPageNode) {
    return <>Workflow is not configured yet</>;
  }

  return (
    <PageNodeSelector
      workflow={workflow}
      conditions={conditions}
      initialPageNode={initialPageNode}
      pageNodes={pageNodes}
    />
  );
}
