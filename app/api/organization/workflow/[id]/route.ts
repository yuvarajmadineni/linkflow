import { db } from "@/lib/db";
import { pageNode, workflows } from "@/lib/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { Edge, Node } from "reactflow";
import { z } from "zod";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const {
    status,
    nodeType,
    parentId,
    nodes: presentNodes,
    edges: presentEdges,
    nodeId,
  } = body;

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

  if (verifiedNodeType.success) {
    let newNodes: Node[] = [
      {
        id: nodeTypeId,
        data: { label: "New page" },
        position: { x: 0, y: 0 },
        type: verifiedNodeType.data,
      },
    ];

    const placeholder = workflowJson.nodes.find(
      (n) => n.type === "placeholderNode"
    );

    let isFirstNode = false;

    const updateEdges = presentEdges.map((edge: Edge) => {
      if (nodeId && edge.source === nodeId && edge.target === placeholder?.id) {
        edge.target = nodeTypeId;
        isFirstNode = true;
      } else if (edge.target === parentId) {
        edge.target = nodeTypeId;
      }
      return edge;
    })!;

    let newEdges: Edge[] = [];

    if (parentId) {
      newEdges = [{ id: randomUUID(), source: nodeTypeId, target: parentId }];
    }

    if (nodeId && !isFirstNode) {
      const placeholderId = randomUUID();
      newNodes.push({
        id: placeholderId,
        data: { label: "Placeholder" },
        position: { x: 0, y: 0 },
        type: "placeholderNode",
      });
      newEdges = [
        { id: randomUUID(), source: nodeId, target: nodeTypeId },
        { id: randomUUID(), source: nodeTypeId, target: placeholderId },
      ];
    }

    if (isFirstNode) {
      newEdges = [
        { id: randomUUID(), source: nodeTypeId, target: placeholder?.id! },
      ];
    }

    const nodes = presentNodes.concat(newNodes);
    const edges = updateEdges?.concat(newEdges);
    const [updatedWorkflow] = await db.transaction(async (tx) => {
      const workflowUpdated = await tx
        .update(workflows)
        .set({ buildConfig: { nodes, edges } })
        .where(eq(workflows.id, params.id))
        .returning();

      if (verifiedNodeType.data === "pageNode") {
        await tx
          .insert(pageNode)
          .values({ workflowId: workflow.id, id: nodeTypeId })
          .returning();
      }
      return workflowUpdated;
    });

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
