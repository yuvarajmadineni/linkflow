"use client";
import { DragOverlayWrapper } from "@/components/drag-overlay-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonElement } from "@/components/workflow/components/button-element";
import { Designer } from "@/components/workflow/designer";
import { TextFieldElement } from "@/components/workflow/fields/TextField";
import { PageNodeProperties } from "@/components/workflow/page-node-properties";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Pencil, Save, Smartphone } from "lucide-react";

export default function PageNodeEditor({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 300, tolerance: 5 },
  });

  const sensors = useSensors(mouseSensor, touchSensor);
  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full py-6 px-4 gap-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Smartphone />
            <div className="flex flex-col">
              <div className="flex gap-2 items-center">
                <p className="uppercase text-sm text-muted-foreground">
                  Untitled Page
                </p>
                <Pencil className="h-3 w-3" />
              </div>
              <Badge
                className="text-xs text-muted-foreground max-w-fit"
                variant="lightsecondary"
              >
                ID:{slug}
              </Badge>
            </div>
          </div>
          <div>
            <Button
              variant="ghost"
              className="bg-gray-200 hover:bg-gray-200/90 dark:bg-gray-700 dark:hover:bg-gray-700/90 mr-4"
            >
              <Save />
              Save
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full justify-between h-full">
          <div className="md:basis-[18rem]">
            <ButtonElement element={TextFieldElement} />
          </div>
          <div className="flex-grow mx-auto items-center justify-center relative overflow-y-auto bg-accent h-full  bg-[url('/paper.svg')] dark:bg-url['/paper-dark.svg']">
            <Designer />
          </div>
          <div className="md:basis-[18rem]">
            <PageNodeProperties />
          </div>
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
}
