"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { useModal } from "@/hooks/use-modal-store";
import { ClipboardList } from "lucide-react";

export function EmptyTask() {
  const { onOpen } = useModal();
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Card className="w-[24rem] bg-secondary flex flex-col items-center text-center px-4 py-4 gap-4">
        <CardTitle className="text-center flex flex-col items-center gap-2">
          <ClipboardList className=" stroke-yellow-400" />
          <p>Build your first task pipeline</p>
        </CardTitle>
        <CardContent className="text-muted-foreground">
          Easily automate and assign task to your users with our easy to use
          task automation tool
        </CardContent>
        <CardFooter>
          <Button onClick={() => onOpen("createtaskpipeline")}>
            Create task pipeline
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
