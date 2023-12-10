"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDesigner } from "@/hooks/use-designer-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Element, ElementInstance, ElementsType } from "../workflow-components";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";

const type: ElementsType = "ButtonField";

const extraAttributes = {
  type: "default" as ButtonVariant,
  text: "Button",
};

type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link";

const variants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
];

const propertiesSchema = z.object({
  type: z.enum([
    "default",
    "secondary",
    "outline",
    "ghost",
    "destructive",
    "link",
  ]),
  text: z.string().min(2),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const ButtonElement: Element = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: { icon: PlusCircle, label: "Button" },
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

  const { text, type } = element.extraAttributes;
  return (
    <Button variant={type as ButtonVariant} className="w-full">
      {text}
    </Button>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: ElementInstance;
}) {
  const element = elementInstance as CustomInstance;

  const { text, type } = element.extraAttributes;
  return <Button variant={type}>{text}</Button>;
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: ElementInstance;
}) {
  const { updateElement } = useDesigner();
  const element = elementInstance as CustomInstance;
  const { type, text } = element.extraAttributes;
  const form = useForm({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      type,
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
          name="type"
          render={({ field }) => (
            <FormItem className="flex gap-4 items-center">
              <FormLabel className="mt-2">Type</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Variants</SelectLabel>
                      {variants.map((variant) => (
                        <SelectItem value={variant} key={variant}>
                          {variant.at(0)?.toUpperCase() + variant.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Button Text</FormLabel>
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
      </form>
    </Form>
  );
}
