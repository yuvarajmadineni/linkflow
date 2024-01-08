import { Loader } from "lucide-react";
export default function Loading() {
  return (
    <div className="flex h-full justify-center items-center">
      <Loader className="animate-spin" />
    </div>
  );
}
