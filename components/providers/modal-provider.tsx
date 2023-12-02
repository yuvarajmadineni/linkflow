"use client";
import { useEffect, useState } from "react";
import { SuspendUserModal } from "@/components/modals/suspend-user-modal";
import { BlockUserModal } from "@/components/modals/block-user-modal";
import { DeleteUserModal } from "@/components/modals/delete-user-modal";
import { SuspendGroupModal } from "@/components/modals/suspend-group-modal";
import { DeleteGroupModal } from "@/components/modals/delete-group-modal";
import { DeactivateGroupModal } from "@/components/modals/deactivate-group-modal";
import { CreateWorkflowModal } from "@/components/modals/create-workflow-modal";
import { DeleteWorkflowModal } from "@/components/modals/delete-workflow-modal";

export function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <SuspendUserModal />
      <BlockUserModal />
      <DeleteUserModal />
      <SuspendGroupModal />
      <DeleteGroupModal />
      <DeactivateGroupModal />
      <CreateWorkflowModal />
      <DeleteWorkflowModal />
    </>
  );
}
