import { Edge, Node } from "reactflow";
import { PageNode } from "./utils";

export const getAllParentNodesForNode = (
  nodeId: string,
  nodes: Node[],
  edges: Edge[]
): Node[] => {
  let parentNodes: Node[] = [];
  const targetBranchEdge = edges.find((e) => e.target === nodeId);
  if (!targetBranchEdge) return [];
  const node = nodes.find((n) => n.id === targetBranchEdge?.source);
  parentNodes.push(node!);
  const otherParentNodes = getAllParentNodesForNode(node?.id!, nodes, edges);
  parentNodes = parentNodes.concat(otherParentNodes);
  return parentNodes;
};

export const getAllPageNodeVariables = (pageNode: PageNode) => {
  let extraAttributes: Record<string, any>[] = [];

  pageNode.elements?.forEach((e) => {
    if (e.extraAttributes?.value) extraAttributes.push(e.extraAttributes);
  });

  return { extraAttributes };
};
