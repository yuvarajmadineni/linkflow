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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDesigner } from "@/hooks/use-designer-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToggleRight, Type } from "lucide-react";
import { useEffect } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { Element, ElementInstance, ElementsType } from "../workflow-components";

const type: ElementsType = "SwitchField";

const extraAttributes = {
  label: "Switch",
  helperText: "",
  checked: false,
  value: "",
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(100),
  helperText: z.string().optional(),
  checked: z.boolean().default(false),
  value: z.string().trim().min(1),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const SwitchElement: Element = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: { icon: ToggleRight, label: "Switch" },
  designerComponent: DesignerComponent,
  component: FormComponent,
  propertiesComponent: PropertiesComponent,
  pageComponent:SwitchFieldPageComponent
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

  const { label, checked, helperText } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>{label}</Label>
      <Switch checked={checked} />
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: ElementInstance;
}) {
  const element = elementInstance as CustomInstance;

  const { checked, label, helperText } = element.extraAttributes;
  return (
    <>
      <Label>{label}</Label>
      <Switch defaultChecked={checked} />
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </>
  );
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: ElementInstance;
}) {
  const { updateElement } = useDesigner();
  const element = elementInstance as CustomInstance;
  const { label, helperText, checked, value } = element.extraAttributes;
  const form = useForm({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label,
      helperText,
      checked,
      value,
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The varible name of the field where the value gets stored
              </FormDescription>
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
          name="checked"
          render={({ field }) => (
            <FormItem className="flex gap-4 items-center">
              <FormLabel className="mt-2">Value</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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

export function SwitchFieldPageComponent({
  elementInstance,
  field,
}: {
  elementInstance: ElementInstance;
  field: ControllerRenderProps<any>;
}) {
  const element = elementInstance as CustomInstance;
  const { helperText, label, value } = element.extraAttributes;

  return (
    <>
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        </FormControl>
        {helperText && <FormDescription>{helperText}</FormDescription>}
        <FormMessage />
      </FormItem>
    </>
  );
}
