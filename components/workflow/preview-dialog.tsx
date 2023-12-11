"use client";
import { Divide, ScanEye } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { useDesigner } from "@/hooks/use-designer-store";
import { Elements } from "./workflow-components";
import { PageNodeBuilder } from "./page-node-builder";

export function PreviewDialog() {
  const { elements } = useDesigner();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ScanEye className="h-4 w-4" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
        <div className="px-4 py-2 border-0">
          <p className="text-lg font-bold text-muted-foreground">
            Form Preview
          </p>
          <p className="text-sm text-muted-foreground">
            This is how your form will look like to your users
          </p>
        </div>
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4   dark:bg-url['/paper-dark.svg'] light:bg-[url('/paper.svg')] overflow-y-auto">
          <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-3xl p-8 overflow-y-auto">
            {/* {elements.map((el) => {
              const FormComponent = Elements[el.type].component;
              return <FormComponent key={el.id} elementInstance={el} />;
            })} */}
            <PageNodeBuilder elements={elements} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
