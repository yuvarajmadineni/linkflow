import { Button } from "@/components/ui/button";
import { Element } from "../workflow-components";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export function ButtonElement({ element }: { element: Element }) {
  const { icon: Icon, label } = element.designerBtnElement;
  const draggable = useDraggable({
    id: `designer-btn-${element.type}`,
    data: {
      type: element.type,
      isDesignerButtonElement: true,
    },
  });
  return (
    <Button
      ref={draggable.setNodeRef}
      className={cn(
        "flex flex-col gap-2 h-[120px] w-[120px] cursor-grab",
        draggable.isDragging && "ring-2 ring-primary"
      )}
      variant="outline"
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <Icon className="h-8 w-8 text-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
}

export function ButtonElementDragOverlay({ element }: { element: Element }) {
  const { icon: Icon, label } = element.designerBtnElement;

  return (
    <Button
      className="flex flex-col gap-2 h-[120px] w-[120px] cursor-grab"
      variant="outline"
    >
      <Icon className="h-8 w-8 text-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
}
