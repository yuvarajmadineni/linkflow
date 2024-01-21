"use client";

import { Condition, PageNode, Workflow } from "@/lib/utils";
import { Workflowpage } from "../workflowpage";
import { PageNodeBuilder } from "./page-node-builder";
import { useState } from "react";

export function PageNodeSelector({
  workflow,
  pageNodes,
  initialPageNode,
  conditions,
}: {
  workflow: Workflow;
  pageNodes: PageNode[];
  initialPageNode: PageNode;
  conditions: Condition[];
}) {
  const [pageNode, setPageNode] = useState<PageNode>(initialPageNode);
  return (
    <Workflowpage>
      <PageNodeBuilder
        elements={pageNode.elements!}
        workflow={workflow}
        pageNode={pageNode}
        setPageNode={setPageNode}
        pageNodes={pageNodes}
        conditions={conditions}
      />
    </Workflowpage>
  );
}
