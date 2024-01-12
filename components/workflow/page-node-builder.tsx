"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField } from "../ui/form";
import { ElementInstance, Elements } from "./workflow-components";
import { Fragment } from "react";

export function PageNodeBuilder({ elements }: { elements: ElementInstance[] }) {
  const filterValues = elements
    .filter((el) => !!el.extraAttributes?.value)
    .map((el) => el.extraAttributes?.value) as string[];

  const zodObj: Record<any, any> = {};

  filterValues.forEach((v) => {
    zodObj[v] = z.string().trim().min(1);
  });

  const schema = z.object(zodObj);
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          console.log("values", values);
        })}
        className="flex flex-col gap-4"
      >
        {elements.map((el) => {
          const FormElement = Elements[el.type].component;
          const PageFieldElement = Elements[el.type].pageComponent;
          return (
            <Fragment key={el.id}>
              {PageFieldElement ? (
                <FormField
                  control={form.control}
                  name={el.extraAttributes?.value}
                  render={({ field }) => (
                    <PageFieldElement
                      field={field as any}
                      elementInstance={el}
                    />
                  )}
                  defaultValue=""
                />
              ) : (
                <FormElement elementInstance={el} />
              )}
            </Fragment>
          );
        })}
      </form>
    </Form>
  );
}
