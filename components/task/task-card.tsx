"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { Task, User, Workflow, cn, getUserAvatar } from "@/lib/utils";
import { Copy, MoreVertical, Navigation, Trash, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { UserAvatar } from "../user/user-avatar";

export function TaskCard({
  workflow,
  task,
  user,
}: {
  workflow: Workflow;
  user: User;
  task: Task;
}) {
  const router = useRouter();
  const { onOpen } = useModal();
  const { name } = workflow;
  const { status } = task;
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
    <Card className="max-w-xl bg-secondary">
      <CardContent>
        <CardHeader className="flex flex-row justify-between items-center px-0">
          <CardTitle className="text-base">{name}</CardTitle>
          <Badge
            variant={variant}
            className={cn(
              status === "archived" &&
                "border-transparent bg-primary-foreground hover:bg-primary-foreground/80"
            )}
          >
            {status.at(0)?.toUpperCase() + status.slice(1)}
          </Badge>
        </CardHeader>

        <CardFooter className="p-0 pt-4 flex justify-between">
          <div className="flex gap-2 items-center">
            <UserAvatar
              src={getUserAvatar(user.email)}
              name={user.fullName}
              className="h-4 w-4"
            />
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium">{user.fullName}</p>
              <span className="text-xs text-muted-foreground">
                Assigned user
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="gap-2 flex"
                onClick={() => router.push(`/dashboard/task/${task.id}`)}
              >
                <Navigation className="h-4 w-4" />
                <span className="text-sm">Go to task pipeline</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="gap-2 flex"
                onClick={() => onOpen("archivetask", { task })}
              >
                <Trash className="h-4 w-4" />
                <span className="text-sm">Archive</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onOpen("deletetask", { task })}>
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
