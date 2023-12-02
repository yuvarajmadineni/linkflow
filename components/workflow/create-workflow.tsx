"use client";
import { GitBranch } from "lucide-react";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";

export function CreateWorkflow() {
  const { onOpen } = useModal();
  return (
    <Button onClick={() => onOpen("createworkflow")}>
      <GitBranch className="h-5 w-5 mr-2" /> New workflow
    </Button>
  );
}
