import { BranchNode } from "./BranchNode";
import { PageNode } from "./Pagenode";
import { PlaceholderNode } from "./PlaceholderNode";
import { StartNode } from "./StartNode";

export const nodeTypes = {
  startNode: StartNode,
  placeholderNode: PlaceholderNode,
  pageNode: PageNode,
  branchNode: BranchNode
};
