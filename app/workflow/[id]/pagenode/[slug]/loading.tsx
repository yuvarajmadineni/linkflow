import { Loader } from "lucide-react";
export default function Loading() {
  return (
    <div className="flex h-[100vh] justify-center items-center">
      <Loader className="animate-spin" />
    </div>
  );
}
