"use client";
import { useEffect, useState } from "react";
import { SuspendUserModal } from "../modals/suspend-user-modal";
import { BlockUserModal } from "../modals/block-user-modal";
import { DeleteUserModal } from "../modals/delete-user-modal";

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
    </>
  );
}
