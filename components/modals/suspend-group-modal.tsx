import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

export function SuspendGroupModal() {
  const { isOpen, type, onClose, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { group } = data;

  const isModalOpen = type === "suspendgroup" && isOpen;

  const handleConfirm = async () => {
    setIsLoading(true);
    const res = await fetch(`/api/organization/group/${group?.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "suspended" }),
    });
    setIsLoading(false);

    if (res.ok) {
      toast({ title: "Group Suspended succesfully" });
    } else {
      toast({ title: "Something went wrong, please try again!" });
    }
    router.refresh();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">Suspend Group</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to do this ? <br />
            The group {group?.name} will be suspended permanently
          </DialogDescription>
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
