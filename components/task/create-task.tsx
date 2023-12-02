"use client";
import { GitBranch } from "lucide-react";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";

export function CreateTask() {
  const { onOpen } = useModal();
  return (
    <Button onClick={() => onOpen("createtaskpipeline")}>
       New  Pipeline
    </Button>
  );
}
