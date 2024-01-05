import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import {
  Bell,
  ClipboardList,
  CloudLightning,
  Group,
  Users,
  Users2,
} from "lucide-react";

export function PublishWorkflowModal() {
  const { isOpen, type, onClose, data } = useModal();

  const { workflow } = data;

  const isModalOpen = type === "publishworkflow" && isOpen;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">
            <div className="flex flex-col items-center gap-4">
              <CloudLightning className=" stroke-yellow-400 fill-yellow-400" />
              Good Job
            </div>
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              You just published your first workflow
              <span className="text-primary">{workflow?.name}</span>. Follow
              these steps to ensure your workflow runs smoothly
            </p>
            <ul className="px-3 py-3 bg-secondary flex flex-col gap-2 justify-center rounded-md">
              <li className="flex gap-2">
                <Users2 className="h-5 w-5 text-primary" />
                <p className="text-primary">
                  Assign user groups and users
                  <span className="text-muted-foreground ml-2">
                    to your workflow
                  </span>
                </p>
              </li>
              <li className="flex gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <p className="text-primary">
                  Enable alerts
                  <span className="text-muted-foreground ml-2">
                    to receive notifications about failures in your flow
                  </span>
                </p>
              </li>
            </ul>
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
