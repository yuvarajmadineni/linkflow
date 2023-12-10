"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUndoRedoNodes } from "@/hooks/use-undo-redo-nodes-store";
import { Workflow } from "@/lib/utils";
import { ChevronLeft, Redo, Rocket, Undo, Verified } from "lucide-react";
import { Edge, Node, ReactFlowProvider, useReactFlow } from "reactflow";
import { EditWorkflow } from "./edit-workflow";

export function WorkflowChanges({ workflow }: { workflow: Workflow }) {
  let variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "suspend" = "success";
  if (workflow.status === "draft") {
    variant = "default";
  }

  if (workflow.status === "archived") {
    variant = "suspend";
  }
  return (
    <ReactFlowProvider>
      <section className="bg-gray-200 dark:bg-gray-700 py-2 px-4 w-full flex justify-between items-center">
        <div className="flex gap-4">
          <ChevronLeft />
          <h2 className="text-base">{workflow.name}</h2>
          <Badge variant={variant}>
            {workflow.status.at(0)?.toUpperCase() + workflow.status.slice(1)}
          </Badge>
        </div>
        <div className="flex gap-8 px-4 items-center">
          <Verified className="h-7 w-7 fill-primary stroke-secondary" />
          <div className="flex gap-4 items-center">
            <div>
              <UndoBtn />
              <RedoBtn />
            </div>
            <Button
              variant="secondary"
              disabled={workflow.status === "published"}
            >
              <Rocket className="h-5 w-5 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </section>
      <EditWorkflow workflow={workflow} />
    </ReactFlowProvider>
  );
}

const UndoBtn = () => {
  const { setEdges, setNodes } = useReactFlow();
  const { undo, prevNodes, prevEdges } = useUndoRedoNodes();

  return (
    <Button
      variant="ghost"
      disabled={prevNodes.length === 0 || prevEdges.length === 0}
      onClick={() => {
        const cb = ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
          setNodes(nodes);
          setEdges(edges);
        };
        undo(cb);
      }}
    >
      <Undo />
    </Button>
  );
};
const RedoBtn = () => {
  const { setEdges, setNodes } = useReactFlow();
  const { redo, futureEdges, futureNodes } = useUndoRedoNodes();

  return (
    <Button
      variant="ghost"
      disabled={futureEdges.length === 0 || futureNodes.length === 0}
      onClick={() => {
        const cb = ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
          setNodes(nodes);
          setEdges(edges);
        };
        redo(cb);
      }}
    >
      <Redo />
    </Button>
  );
};
