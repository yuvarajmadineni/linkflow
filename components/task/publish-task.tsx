"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Archive, CloudLightning, Users2 } from "lucide-react";
import { useState } from "react";
import { createTask } from "./_actions/create-task";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { saveTask } from "./_actions/save-task";

export function SaveOrPublishTask({
  userId,
  workflowId,
  taskId,
}: {
  userId: string;
  workflowId: string;
  taskId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const publishTask = async () => {
    if (!workflowId || !userId) {
      toast({
        title: "Please select user and workflow",
        variant: "destructive",
      });
      return;
    }
    try {
      setSubmitting(true);
      if (!taskId) {
        await createTask({ workflowId, userId, status: "published" });
        setOpen(true);
      } else {
        await saveTask({ workflowId, userId, taskId });
      }
    } catch (e) {
      toast({
        title: `Failed to ${taskId ? "save" : "pubish"} the task`,
        variant: "destructive",
      });
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button onClick={publishTask} disabled={submitting}>
          {taskId ? "Save changes" : "Publish"}
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">
            <div className="flex flex-col items-center gap-4">
              <CloudLightning className="stroke-yellow-400 fill-yellow-400" />
              Nice
            </div>
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              You just published your first task pipeline. Here is what to
              expect
            </p>
            <ul className="px-3 py-3 bg-secondary flex flex-col gap-2 justify-center rounded-md">
              <li className="flex gap-2">
                <Users2 className="h-5 w-5 text-primary" />
                <p className="text-muted-foreground">
                  Users and groups assigned to your task pipeline would be
                  notified
                </p>
              </li>
              <li className="flex gap-2">
                <Archive className="h-5 w-5 text-primary" />
                <p className="text-muted-foreground">
                  You can archive a task pipeline line or delete it if you want
                </p>
              </li>
            </ul>
          </div>
        </DialogDescription>
        <DialogFooter>
          <DialogClose>
            <Button
              onClick={() => {
                setOpen(false);
                router.replace("/dashboard/task");
              }}
            >
              Got it
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
