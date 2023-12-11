"use client";

import { ArrowDown, ChevronDown, Text, X } from "lucide-react";
import { Element, ElementInstance, ElementsType } from "../workflow-components";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useDesigner } from "@/hooks/use-designer-store";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const type: ElementsType = "SelectField";

const extraAttributes = {
  label: "Select",
  helperText: "",
  required: false,
  placeholder: "",
  options: [],
  value: "",
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50),
  options: z.string().array(),
  value: z.string(),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

export const SelectFieldElement: Element = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: { icon: ChevronDown, label: "Select" },
  designerComponent: DesignerComponent,
  component: FormComponent,
  propertiesComponent: PropertiesComponent,
  pageComponent: SelectFieldPageComponent,
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

  const { label, required, placeholder, helperText, options } =
    element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
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

  const { label, required, placeholder, helperText, options } =
    element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: ElementInstance;
}) {
  const { updateElement } = useDesigner();
  const element = elementInstance as CustomInstance;
  const { label, required, helperText, placeholder, options, value } =
    element.extraAttributes;
  const form = useForm({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label,
      required,
      helperText,
      placeholder,
      options,
      value,
    },
  });

  const [selectOptions, setSelectOptions] = useState<string[]>(options);
  const [option, setOption] = useState("");

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [form, element]);

  function applyChanges(values: PropertiesSchemaType) {
    updateElement(element.id, {
      ...element,
      extraAttributes: { ...values, options: selectOptions },
    });
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
        <div className="flex flex-col gap-2">
          <Label>Options</Label>
          <Input
            value={option}
            onChange={(e) => setOption(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                setSelectOptions((prev) => [...prev, option]);
                setOption("");
                updateElement(element.id, {
                  ...element,
                  extraAttributes: {
                    ...element.extraAttributes,
                    options: selectOptions,
                  },
                });
              }
            }}
          />
          <div className="space-x-2">
            {selectOptions.map((op, i) => (
              <Badge
                key={i}
                className="w-fit"
                onClick={(e) => {
                  setSelectOptions((prev) => prev.filter((v) => v !== op));
                  updateElement(element.id, {
                    ...element,
                    extraAttributes: {
                      ...element.extraAttributes,
                      options: selectOptions.filter((v) => v !== op),
                    },
                  });
                }}
              >
                {op}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>
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

export function SelectFieldPageComponent({
  elementInstance,
  field,
}: {
  elementInstance: ElementInstance;
  field: ControllerRenderProps<any>;
}) {
  const element = elementInstance as CustomInstance;
  const { helperText, label, options, placeholder } = element.extraAttributes;

  return (
    <>
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Select {...field} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        {helperText && <FormDescription>{helperText}</FormDescription>}
        <FormMessage />
      </FormItem>
    </>
  );
}
