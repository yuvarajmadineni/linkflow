"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Workflow } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Copy, MoreVertical, Trash, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const { onOpen } = useModal();
  const { name, status, createdAt } = workflow;
  const date = format(createdAt, "MMMM d, yyyy");
  let variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "suspend" = "success";
  if (status === "draft") {
    variant = "default";
  }

  if (status === "archived") {
    variant = "suspend";
  }

  return (
    <Card className="w-72 bg-secondary">
      <CardContent>
        <CardHeader className="flex flex-row justify-between items-center px-0">
          <CardTitle className="text-base">{name}</CardTitle>
          <Badge variant={variant}>
            {status.at(0)?.toUpperCase() + status.slice(1)}
          </Badge>
        </CardHeader>
        <div>
          <p className="text-xs text-muted-foreground">Created</p>
          <span className="text-sm font-normal">{date}</span>
        </div>
        <CardFooter className="p-0 pt-4 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="hover:bg-primary-foreground">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="gap-2 flex">
                <Copy className="h-4 w-4" />
                <span className="text-sm">Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 flex">
                <Trash className="h-4 w-4" />
                <span className="text-sm">Archive</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onOpen("deleteworkflow", { workflow })}
              >
                <div className="flex gap-2 text-red-500">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
