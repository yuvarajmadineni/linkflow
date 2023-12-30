"use client";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { Layout } from "./force-layout";

import { Workflow } from "@/lib/utils";
import "reactflow/dist/style.css";
import { nodeTypes } from "./nodes/types";
import { useUndoRedoNodes } from "@/hooks/use-undo-redo-nodes-store";
import { useEffect } from "react";

const defaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed },
  pathOptions: { offset: 5 },
};

export function EditWorkflow({ workflow }: { workflow: Workflow }) {
  const [nodes, __, onNodesChange] = useNodesState([]);
  const [edges, _, onEdgesChange] = useEdgesState([]);
  const { setEdges, setNodes } = useReactFlow();

  const { setNodesEdges } = useUndoRedoNodes();

  useEffect(() => {
    setNodesEdges(workflow.buildConfig!);
    setNodes(workflow.buildConfig?.nodes!);
    setEdges(workflow.buildConfig?.edges!);
  }, [setEdges, setNodes, setNodesEdges, workflow]);

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
