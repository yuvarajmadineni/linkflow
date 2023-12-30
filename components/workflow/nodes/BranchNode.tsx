import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { useUndoRedoNodes } from "@/hooks/use-undo-redo-nodes-store";
import {
  GitBranch,
  Link,
  MoreVertical,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import { deleteCondtion } from "../_actions/delete-condition";

export function BranchNode(props: NodeProps) {
  const params = useParams();
  const { nodes, edges, update } = useUndoRedoNodes();
  const { setNodes, setEdges } = useReactFlow();
  const [isLoading, setIsLoading] = useState(false);
  async function addCondition() {
    setIsLoading(true);
    const res = await fetch(`/api/organization/workflow/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        nodeType: "pageNode",
        nodes,
        edges,
        nodeId: props.id,
      }),
    });

    if (res.ok) {
      toast({ title: "Succesfully added new condition" });
      const responseData = await res.json();
      setNodes(responseData.data.buildConfig.nodes);
      setEdges(responseData.data.buildConfig.edges);
      update(responseData.data.buildConfig);
    } else {
      toast({ title: `Something went wrong while adding a condition` });
    }
    setIsLoading(false);
  }

  const placeholder = nodes.find((node) => node.type === "placeholderNode");

  const conditionEdges = edges.filter(
    (edge) => edge.source === props.id && edge.target !== placeholder?.id
  );

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <Handle type="target" position={Position.Top} />
          <div className="rounded-full bg-secondary flex items-center gap-2 px-4 py-2 w-44 max-w-xl">
            <GitBranch className="h-4 w-4" />
            <div className="flex flex-col">
              <p className="text-base leading-tight">Output</p>
              <span className="text-xs text-muted-foreground">Branch node</span>
            </div>
          </div>
          <Handle type="source" position={Position.Bottom} />
        </SheetTrigger>
        <SheetContent className="flex flex-col justify-between overflow-y-scroll">
          <div className="flex flex-col gap-4">
            <SheetHeader>
              <SheetTitle className="flex gap-2">
                <GitBranch className="h-6 w-6" />
                <p className="capitalize">Branch node</p>
              </SheetTitle>
              <SheetDescription>ID {props.id}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    {"{i}"} 3 variables available
                  </AccordionTrigger>
                  <AccordionContent>
                    Simply drag variables into the required forms. You can also
                    begin typing to insert a variable with autocomplete
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {conditionEdges.map((c) => (
                <Condition
                  key={c.id}
                  targetId={c.id}
                  workflowId={params.id as string}
                />
              ))}
            </div>
          </div>
          <SheetFooter className="sm:justify-start">
            <Button variant="ghost" onClick={addCondition} disabled={isLoading}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add condition
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

const Condition = ({
  workflowId,
  targetId,
}: {
  workflowId: string;
  targetId: string;
}) => {
  return (
    <div className="bg-primary/10 pb-4 px-3">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label>IF</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={async () => {
                  await deleteCondtion({ workflowId, targetId });
                }}
              >
                <Trash2 className="mr-2 h-4 w-4 text-red-500" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-4 items-center">
          <Input />
          <Button variant="ghost">
            <Link className="h-4 w-4" />
          </Button>
        </div>
        <Select>
          <SelectTrigger>Select a condition</SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">equals</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-4 items-center">
          <Input />
          <Button variant="ghost">
            <Link className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
