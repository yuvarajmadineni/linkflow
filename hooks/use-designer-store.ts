import { ElementInstance } from "@/components/workflow/workflow-components";
import { create } from "zustand";

interface Designer {
  elements: ElementInstance[];
  addElement: (index: number, element: ElementInstance) => void;
  removeElement: (id: string) => void;
  selectedElement: ElementInstance | null;
  setSelectedElement: (element: ElementInstance | null) => void;
  updateElement: (id: string, element: ElementInstance) => void;
  setElements: (elements: ElementInstance[]) => void;
}

export const useDesigner = create<Designer>((set, get) => ({
  elements: [],
  addElement: (index: number, element: ElementInstance) => {
    const newElements = [...get().elements];
    newElements.splice(index, 0, element);
    set({ elements: newElements });
  },
  removeElement: (id: string) =>
    set({ elements: get().elements.filter((el) => el.id !== id) }),
  selectedElement: null,
  setSelectedElement: (element: ElementInstance | null) =>
    set({ selectedElement: element }),
  updateElement: (id: string, element: ElementInstance) => {
    const newElements = [...get().elements];
    const index = newElements.findIndex((el) => el.id === id);
    newElements[index] = element;
    set({ elements: newElements });
  },
  setElements: (elements: ElementInstance[]) => set({ elements }),
}));
