"use server";

import { db } from "@/lib/db";
import { condition, workflows } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Edge, Node } from "reactflow";

export async function deleteCondition({
  workflowId,
  targetId,
  conditionId,
}: {
  workflowId: string;
  targetId: string;
  conditionId: string;
}) {
  const [workflow] = await db
    .select()
    .from(workflows)
    .where(eq(workflows.id, workflowId));

  const { nodes, edges } = workflow.buildConfig!;

  const { nodesToDelete, edgesToDelete } = getNodesAndEdgesToDelete(
    targetId,
    nodes,
    edges
  );

  const nodeIds = nodesToDelete.map((n) => n.id);
  const edgeIds = edgesToDelete.map((e) => e.id);

  const otherNodes = nodes.filter((node) => !nodeIds.includes(node.id));
  const otherEdges = edges.filter((edge) => !edgeIds.includes(edge.id));

  const [updatedWorkflow] = await db.transaction(async (tx) => {
    const workflow = await tx
      .update(workflows)
      .set({
        buildConfig: {
          nodes: otherNodes,
          edges: otherEdges,
        },
      })
      .where(eq(workflows.id, workflowId))
      .returning();

    await db.delete(condition).where(eq(condition.id, conditionId));
    return workflow;
  });

  revalidatePath(`/workflow/${workflowId}`);

  return updatedWorkflow;
}

const getNodesAndEdgesToDelete = (
  edgeId: string,
  nodes: Node[],
  edges: Edge[]
) => {
  let nodesToDelete: Node[] = [];
  let edgesToDelete: Edge[] = [];
  const edge = edges.find((e) => e.id === edgeId);
  edgesToDelete.push(edge!);
  const node = nodes.find((n) => n.id === edge?.target);
  nodesToDelete.push(node!);
  const nextEdges = edges.filter((edge) => edge.source === node?.id);
  nextEdges.forEach((e) => {
    const { nodesToDelete: remainingNodes, edgesToDelete: remainingEdges } =
      getNodesAndEdgesToDelete(e.id, nodes, edges);
    nodesToDelete = nodesToDelete.concat(remainingNodes);
    edgesToDelete = edgesToDelete.concat(remainingEdges);
  });
  return { nodesToDelete, edgesToDelete };
};
