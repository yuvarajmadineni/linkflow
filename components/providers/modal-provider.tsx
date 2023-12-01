"use client";
import { useEffect, useState } from "react";
import { SuspendUserModal } from "../modals/suspend-user-modal";
import { BlockUserModal } from "../modals/block-user-modal";
import { DeleteUserModal } from "../modals/delete-user-modal";
import { SuspendGroupModal } from "../modals/suspend-group-modal";
import { DeleteGroupModal } from "../modals/delete-group-modal";
import { DeactivateGroupModal } from "../modals/deactivate-group-modal";

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
    </>
  );
}
