import { db } from "@/lib/db";
import { workflows } from "@/lib/schema";
import { randomUUID } from "crypto";
import { eq, param } from "drizzle-orm";
import { Edge, Node } from "reactflow";
import { z } from "zod";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const { status, nodeType, parentId } = body;

  const statusSchema = z.enum(["published", "draft", "archived"]);

  const typeSchema = z.enum(["pageNode", "branchNode"]);

  const verifiedStatus = statusSchema.safeParse(status);
  const verifiedNodeType = typeSchema.safeParse(nodeType);

  const [workflow] = await db
    .select()
    .from(workflows)
    .where(eq(workflows.id, params.id));

  if (!workflow) {
    return new Response("Workflow does not exist", { status: 404 });
  }

  if (verifiedStatus.success) {
    const [updatedWorkflow] = await db
      .update(workflows)
      .set({ status: verifiedStatus.data })
      .where(eq(workflows.id, params.id))
      .returning();

    return Response.json({ success: true, data: updatedWorkflow });
  }

  const workflowJson = workflow.buildConfig;

  if (!workflowJson) {
    return new Response("Workflow json does not exist", { status: 400 });
  }

  const nodeTypeId = randomUUID();
  const placeholderId = randomUUID();

  if (verifiedNodeType.success) {
    const newNodes: Node[] = [
      {
        id: nodeTypeId,
        data: { label: "New page" },
        position: { x: 0, y: 0 },
        type: verifiedNodeType.data,
      },
    ];

    const updateEdges = workflow.buildConfig?.edges.map((edge) => {
      if (edge.target === parentId) {
        edge.target = nodeTypeId;
      }
      return edge;
    })!;

    const newEdges: Edge[] = [
      { id: randomUUID(), source: nodeTypeId, target: parentId },
    ];

    const nodes = workflowJson.nodes.concat(newNodes);
    const edges = updateEdges?.concat(newEdges);
    const [updatedWorkflow] = await db
      .update(workflows)
      .set({ buildConfig: { nodes, edges } })
      .where(eq(workflows.id, params.id))
      .returning();

    return Response.json({ success: true, data: updatedWorkflow });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const [workflow] = await db
    .select()
    .from(workflows)
    .where(eq(workflows.id, params.id));

  if (!workflow) {
    return new Response("Workflow does not exist", { status: 404 });
  }

  const [deletedWorkflow] = await db
    .delete(workflows)
    .where(eq(workflows.id, params.id))
    .returning();

  return Response.json({ success: true, data: deletedWorkflow });
}
