"use client";

import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { ElementInstance } from "../workflow/workflow-components";

type DesignerContextType = {
  elements: ElementInstance[];
  addElement: (index: number, element: ElementInstance) => void;
  removeElement: (id: string) => void;
  selectedElement: ElementInstance | null;
  setSelectedElement: Dispatch<SetStateAction<ElementInstance | null>>;
  updateElement: (id: string, element: ElementInstance) => void;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export function DesignerContextProvider({ children }: PropsWithChildren) {
  const [elements, setElements] = useState<ElementInstance[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<ElementInstance | null>(null);

  const addElement = (index: number, element: ElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      newElements.splice(index, 0, element);
      return newElements;
    });
  };

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const updateElement = (id: string, element: ElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      const index = newElements.findIndex((el) => el.id === id);
      newElements[index] = element;
      return newElements
    });
  };

  return (
    <DesignerContext.Provider
      value={{
        elements,
        addElement,
        removeElement,
        selectedElement,
        setSelectedElement,updateElement
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
}
