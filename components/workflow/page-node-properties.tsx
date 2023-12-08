import { useDesigner } from "@/hooks/use-designer";
import { Elements } from "./workflow-components";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Separator } from "../ui/separator";

export function PageNodeProperties() {
  const { selectedElement, setSelectedElement } = useDesigner();

  if (!selectedElement) return null;

  const PropertiesForm = Elements[selectedElement.type].propertiesComponent;

  return (
    <div className="flex flex-col p-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-foreground/70">Element Properties</p>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setSelectedElement(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Separator className="mb-4" />
      <PropertiesForm elementInstance={selectedElement} />
    </div>
  );
}
