"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useDesigner } from "@/hooks/use-designer-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Type } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Element, ElementInstance, ElementsType } from "../workflow-components";
import { Textarea } from "@/components/ui/textarea";

const type: ElementsType = "Text";

const extraAttributes = {
  text: "Text",
};

const propertiesSchema = z.object({
  text: z.string().min(2).max(100),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const TextElement: Element = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: { icon: Type, label: "Text" },
  designerComponent: DesignerComponent,
  component: FormComponent,
  propertiesComponent: PropertiesComponent,
};

type CustomInstance = ElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: ElementInstance;
}) {
  const element = elementInstance as CustomInstance;

  const { text } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Text</Label>
      <p className="text-base">{text}</p>
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: ElementInstance;
}) {
  const element = elementInstance as CustomInstance;

  const { text } = element.extraAttributes;
  return <p className="text-xl">{text}</p>;
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: ElementInstance;
}) {
  const { updateElement } = useDesigner();
  const element = elementInstance as CustomInstance;
  const { text } = element.extraAttributes;
  const form = useForm({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      text,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [form, element]);

  function applyChanges(values: PropertiesSchemaType) {
    updateElement(element.id, { ...element, extraAttributes: { ...values } });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
