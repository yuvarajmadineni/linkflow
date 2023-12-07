import { GitBranch } from "lucide-react";
import { Handle, Position } from "reactflow";

export function BranchNode() {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="rounded-full bg-secondary flex items-center gap-2 px-4 py-2 w-44 max-w-xl">
        <GitBranch className="h-4 w-4" />
        <div className="flex flex-col">
          <p className="text-base leading-tight">Output</p>
          <span className="text-xs text-muted-foreground">Branch node</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
