"use client";

import { Text } from "lucide-react";
import { Element, ElementInstance, ElementsType } from "../workflow-components";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useDesigner } from "@/hooks/use-designer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

const type: ElementsType = "TextField";

const extraAttributes = {
  label: "Text Field",
  helperText: "Helper text",
  required: false,
  placeholder: "Value here",
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const TextFieldElement: Element = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: { icon: Text, label: "Textfield" },
  designerComponent: DesignerComponent,
  component: () => <div> component</div>,
  propertiesComponent: PropertiesComponent,
};

type CustomInstance = ElementInstance & {
  extraAttributes?: typeof extraAttributes;
};

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: ElementInstance;
}) {
  const { updateElement } = useDesigner();
  const element = elementInstance as CustomInstance;
  const { label, required, helperText, placeholder } = element.extraAttributes;
  const form = useForm({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label,
      required,
      helperText,
      placeholder,
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
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field <br /> It will be displayed above the
                field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>The placeholder of the field</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper Text</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The helpertext of the field <br /> It will be displayed below
                the field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border shadow-sm p-3">
              <div className="space-y-0.5">
                <FormLabel>Required </FormLabel>
                <FormDescription>
                  The helpertext of the field <br /> It will be displayed below
                  the field
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: ElementInstance;
}) {
  const element = elementInstance as CustomInstance;

  const { label, required, placeholder, helperText } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Input readOnly disabled placeholder={placeholder} />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}
