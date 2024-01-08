import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";
import { deleteTask } from "../task/_actions/delete-task";

export function DeleteTask() {
  const { isOpen, type, onClose, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const { task } = data;

  const isModalOpen = type === "deletetask" && isOpen;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await deleteTask(task?.id!);
      toast({ title: "Successfully deleted the task" });
    } catch (e) {
      toast({ title: "Failed to delete the task" });
    }
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">Delete Task</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to do this ? <br />
            The task will be deleted permanently
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
