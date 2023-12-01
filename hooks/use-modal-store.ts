import { create } from "zustand";
import { Group, User } from "@/lib/utils";

export type ModalType =
  | "suspenduser"
  | "deleteuser"
  | "deactivateuser"
  | "suspendgroup"
  | "deletegroup"
  | "deactivategroup";

interface ModalData {
  user?: User;
  group?: Group;
}
interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type, data, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false }),
}));