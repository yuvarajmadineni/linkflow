import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";
import { ButtonElementDragOverlay } from "./workflow/components/button-element";
import { Elements, ElementsType } from "./workflow/workflow-components";
import { useDesigner } from "@/hooks/use-designer-store";

export function DragOverlayWrapper() {
  const { elements } = useDesigner();
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

  const isDesignerElement = draggedItem?.data.current?.isDesignerElement;

  if (isDesignerElement) {
    const elementId = draggedItem.data?.current?.elementId;
    const element = elements.find((el) => el.id === elementId);
    if (!element) {
      node = <div>Element not found</div>;
    } else {
      const DesignerElementComponent = Elements[element.type].designerComponent;
      node = (
        <div className="flex bg-accent border rounded-md  w-full py-2 px-4 opacity-80 pointer-events-none">
          <DesignerElementComponent elementInstance={element} />
        </div>
      );
    }
  }

  return <DragOverlay className="z-30">{node}</DragOverlay>;
}
