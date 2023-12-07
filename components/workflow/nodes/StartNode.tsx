import { PlayCircle } from "lucide-react";
import { Handle, Position } from "reactflow";

export function StartNode() {
  return (
    <>
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
      <div className="bg-secondary rounded-full flex gap-2 justify-center  items-center px-4 py-2 w-44 max-w-xl">
        <PlayCircle className="h-4 w-4" />
        <h4 className="text-base font-normal">Start</h4>
      </div>
    </>
  );
}
