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
  let variables: string[] = [];
  pageNode.elements?.forEach((e) => {
    const value = e.extraAttributes?.value;
    if (value) {
      variables.push(value);
    }
  });

  return variables;
};
