"use client";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SeparatorHorizontal, Text } from "lucide-react";
import { Element, ElementInstance, ElementsType } from "../workflow-components";

const type: ElementsType = "SeperatorField";

export const SeperatorFieldElement: Element = {
  type,
  construct: (id: string) => ({
    id,
    type,
  }),
  designerBtnElement: { icon: SeparatorHorizontal, label: "Seperator" },
  designerComponent: DesignerComponent,
  component: FormComponent,
  propertiesComponent: PropertiesComponent,
};

function DesignerComponent() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Seperator Field</Label>
      <Separator />
    </div>
  );
}

function FormComponent() {
  return <Separator />;
}

function PropertiesComponent() {
  return <p>No properties for this element</p>;
}
