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
  let types: string[] = [];
  let variableTypes: Record<string, string> = {};
  pageNode.elements?.forEach((e) => {
    const value = e.extraAttributes?.value;
    const type = e.extraAttributes?.type;
    if (value) {
      variables.push(value);
      variableTypes[value] = type;
      types.push(type);
    }
  });

  return { variables, types, variableTypes };
};
