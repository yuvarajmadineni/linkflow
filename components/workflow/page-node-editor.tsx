"use client";
import { DragOverlayWrapper } from "@/components/drag-overlay-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ButtonElement } from "@/components/workflow/components/button-element";
import { Designer } from "@/components/workflow/designer";
import { SeperatorFieldElement } from "@/components/workflow/fields/SeperatorField";
import { SpacerFieldElement } from "@/components/workflow/fields/SpacerField";
import { SwitchElement } from "@/components/workflow/fields/Switch";
import { TextElement } from "@/components/workflow/fields/Text";
import { ButtonElement as ButtonFieldElement } from "@/components/workflow/fields/Button";
import { TextFieldElement } from "@/components/workflow/fields/TextField";
import { PageNodeProperties } from "@/components/workflow/page-node-properties";
import { PreviewDialog } from "@/components/workflow/preview-dialog";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Save, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { SelectFieldElement } from "@/components/workflow/fields/Select";
import { useDesigner } from "@/hooks/use-designer-store";
import { toast } from "@/components/ui/use-toast";
import { savePageNodeProperties } from "@/app/workflow/[id]/pagenode/[slug]/_actions";
import { PageNode } from "@/lib/utils";

export function PageNodeEditor({
  params,
  pageNodeProperties,
}: {
  params: { slug: string; id: string };
  pageNodeProperties: PageNode;
}) {
  const { slug, id } = params;
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(pageNodeProperties.name || "");
  const { elements, setElements } = useDesigner();

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 300, tolerance: 5 },
  });

  const onSave = async () => {
    try {
      setLoading(true);
      await savePageNodeProperties({
        name,
        elements,
        title: "",
        workflowId: id,
        nodeId: slug,
      });
      setLoading(false);
      toast({ title: "Page node properties saved succesfully" });
    } catch (e) {
      toast({
        title: "Failed to save page node properties",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    if (pageNodeProperties.elements) setElements(pageNodeProperties.elements);
  }, [pageNodeProperties, setElements]);
  return (
    <DndContext sensors={sensors}>
      <div className="flex flex-col w-full py-6 px-4 gap-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Smartphone />
            <div className="flex flex-col">
              <div className="flex gap-2 items-center">
                <p className="uppercase text-sm text-muted-foreground">
                  {name || "Untitled Page"}
                </p>
              </div>
              <Badge
                className="hidden sm:block text-xs text-muted-foreground max-w-fit"
                variant="lightsecondary"
              >
                ID:{slug}
              </Badge>
            </div>
          </div>
          <div className="flex gap-4">
            <PreviewDialog />
            <Button
              variant="ghost"
              className="gap-2"
              onClick={onSave}
              disabled={loading}
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
        <div className="flex flex-col  sm:grid  sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-7 w-full h-full gap-4">
          <div className="md:col-span-1 lg:col-span-2">
            <p className="text-sm text-foreground/70">Drag and Drop Elements</p>
            <Separator className="my-2" />
            <p className="text-base font-bold text-primary my-2 place-self-start">
              Components
            </p>
            <div className="grid grid-cols-4 md:grid-cols-2 place-items-center gap-2">
              <ButtonElement element={TextElement} />
              <ButtonElement element={SeperatorFieldElement} />
              <ButtonElement element={SpacerFieldElement} />
              <ButtonElement element={TextFieldElement} />
              <ButtonElement element={SwitchElement} />
              <ButtonElement element={ButtonFieldElement} />
              <ButtonElement element={SelectFieldElement} />
            </div>
          </div>
          <div className="flex-grow sm:col-span-2 overflow-y-auto bg-accent h-full dark:bg-url['/paper-dark.svg'] light:bg-[url('/paper.svg')] md:col-span-3 lg:col-span-3">
            <Designer />
          </div>
          <div className="col-span-2">
            <PageNodeProperties name={name} setName={setName} />
          </div>
        </div>
      </div>
      <DragOverlayWrapper />
    </DndContext>
  );
}
