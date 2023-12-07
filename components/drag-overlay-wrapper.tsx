import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";
import { ButtonElementDragOverlay } from "./workflow/components/button-element";
import { Elements, ElementsType } from "./workflow/workflow-components";

export function DragOverlayWrapper() {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  let node = <div>No drag overlay</div>;

  const isSidebarBtnElement =
    draggedItem?.data.current?.isDesignerButtonElement;

  if (isSidebarBtnElement) {
    const type = draggedItem.data.current?.type as ElementsType;
    node = <ButtonElementDragOverlay element={Elements[type]} />;
  }

  return <DragOverlay className="z-30">{node}</DragOverlay>;
}
