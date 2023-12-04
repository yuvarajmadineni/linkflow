"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { CloudLightning } from "lucide-react";

export function EmptyWorkflow() {
  const { onOpen } = useModal();
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Card className="w-[24rem] bg-secondary flex flex-col items-center text-center px-4 py-4 gap-4">
        <CardTitle className="text-center flex flex-col items-center gap-2">
          <CloudLightning className="fill-yellow-400 stroke-yellow-400" />
          <p>Ready to build your first worfklow?</p>
        </CardTitle>
        <CardContent className="text-muted-foreground">
          Get started in seconds with our easy to use drag and drop workflow
          builder!
        </CardContent>
        <CardFooter>
          <div
            className={cn(buttonVariants())}
            onClick={() => onOpen("createworkflow")}
            role="button"
          >
            Build Workflow
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
