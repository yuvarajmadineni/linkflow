import { Smartphone } from "lucide-react";
import { Handle, NodeProps, Position } from "reactflow";

export function PageNode(props: NodeProps<{ label: string }>) {
  const { data } = props;
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="rounded-full bg-secondary flex items-center gap-2 px-4 py-2 w-44 max-w-xl">
        <Smartphone className="h-4 w-4" />
        <div className="flex flex-col">
          <p className="text-base leading-tight">{data.label}</p>
          <span className="text-xs text-muted-foreground">Page node</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
