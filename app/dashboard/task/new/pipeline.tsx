"use client";
import { SaveOrPublishTask } from "@/components/task/publish-task";
import { Badge } from "@/components/ui/badge";
import { SearchUsers } from "@/components/user/search-users";
import { SearchWorkflows } from "@/components/workflow/search-workflows";
import { Task, User, Workflow } from "@/lib/utils";
import { ClipboardList } from "lucide-react";
import { useState } from "react";

export function Pipeline({
  users,
  workflows,
  task,
}: {
  users: User[];
  workflows: Workflow[];
  task?: Task;
}) {
  const [user, setUser] = useState(task?.userId || "");
  const [workflow, setWorkflow] = useState(task?.workflowId || "");
  return (
    <>
      <div className="flex justify-between">
        <h3 className="text-3xl font-semibold">New Pipeline</h3>
        <SaveOrPublishTask
          userId={user}
          workflowId={workflow}
          taskId={task?.id}
        />
      </div>
      <div className="flex justify-center items-center h-full flex-col">
        <div className="bg-secondary px-8 py-2 flex flex-col gap-2 rounded-lg items-center border-muted-foreground border">
          <ClipboardList className="h-7 w-7" />
          <p className="text-base font-bold">Initial Trigger</p>
          <p className="text-sm text-muted-foreground">
            When a task is received in this pipeline
          </p>
        </div>
        <div className="border border-secondary h-[2rem]"></div>

        <div className="border border-muted-foreground px-8 flex flex-col rounded-md py-4 lg:w-3/6 md:w-full">
          <div className="bg-primary/5">
            <div className="px-2 py-2 flex gap-4 items-center">
              <Badge
                className="px-2 py-2 rounded-sm min-w-fit text-sm text-muted-foreground font-normal"
                variant="lightsecondary"
              >
                Assign task to
              </Badge>
              <span className="text-sm text-muted-foreground font-bold">
                TO
              </span>
              <SearchUsers users={users} value={user} setValue={setUser} />
            </div>
          </div>
          <div className="h-[5rem] w-0 text-center self-center border border-secondary" />
          <div className="bg-primary/5">
            <div className="px-2 py-2 flex gap-6 items-center">
              <Badge
                className="px-2 py-2 rounded-sm min-w-fit text-sm text-muted-foreground font-normal"
                variant="lightsecondary"
              >
                With workflow
              </Badge>
              <SearchWorkflows
                workflows={workflows}
                value={workflow}
                setValue={setWorkflow}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
