import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { GitBranch, PlusCircle, Smartphone } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";

export function PlaceholderNode(props: NodeProps) {
  const router = useRouter();
  const params = useParams();
  const { setNodes, setEdges } = useReactFlow();
  const handleAddNode = async (type: "pageNode" | "branchNode") => {
    const res = await fetch(`/api/organization/workflow/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify({ nodeType: type, parentId: props.id }),
    });

    if (res.ok) {
      toast({ title: `${type} created succesfully` });
      const responseData = await res.json();
      setNodes(responseData.data.buildConfig.nodes);
      setEdges(responseData.data.buildConfig.edges);
    } else {
      toast({ title: `Something went wrong while creating ${type}` });
    }

    router.refresh();
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="w-44 max-w-xl flex items-center justify-center">
            <PlusCircle className="h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Choose node to add</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => handleAddNode("pageNode")}
          >
            <Smartphone className="h-4 w-4" />
            <span>Page node</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => handleAddNode("branchNode")}
          >
            <GitBranch className="h-4 w-4" />
            <span>Branch node</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
