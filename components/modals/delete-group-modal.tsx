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

export function DeleteGroupModal() {
  const { isOpen, type, onClose, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { group } = data;

  const isModalOpen = type === "deletegroup" && isOpen;

  const handleConfirm = async () => {
    setIsLoading(true);
    const res = await fetch(`/api/organization/group/${group?.id}`, {
      method: "DELETE",
    });
    setIsLoading(false);

    if (res.ok) {
      toast({ title: "Group deleted succesfully" });
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
          <DialogTitle className="text-center">Delete Group</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to do this ? <br />
            The group {group?.name} will be deleted permanently
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
