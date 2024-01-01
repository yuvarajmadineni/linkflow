"use client";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { Layout } from "./force-layout";

import { Condition, PageNode, Workflow } from "@/lib/utils";
import "reactflow/dist/style.css";
import { nodeTypes } from "./nodes/types";
import { useWorkflow } from "@/hooks/use-undo-redo-nodes-store";
import { useEffect } from "react";

const defaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed },
  pathOptions: { offset: 5 },
};

export function EditWorkflow({
  workflow,
  pageNodes,
  conditions,
}: {
  workflow: Workflow;
  pageNodes: PageNode[];
  conditions: Condition[];
}) {
  const [nodes, __, onNodesChange] = useNodesState(
    workflow.buildConfig?.nodes!
  );
  const [edges, _, onEdgesChange] = useEdgesState(workflow.buildConfig?.edges!);

  const { setNodesEdges, setWorkflow } = useWorkflow();

  useEffect(() => {
    setNodesEdges(workflow.buildConfig!);
    setWorkflow({ pageNodes, workflow, conditions });
  }, [pageNodes, setNodesEdges, setWorkflow, workflow]);

  return (
    <div className="h-[85vh] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={null}
        fitView={true}
        defaultEdgeOptions={defaultEdgeOptions}
        nodesDraggable={false}
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background />
        <Layout />
      </ReactFlow>
    </div>
  );
}
