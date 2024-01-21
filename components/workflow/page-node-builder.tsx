"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField } from "../ui/form";
import { ElementInstance, Elements } from "./workflow-components";
import { Dispatch, Fragment, SetStateAction } from "react";
import { Condition, PageNode, Workflow } from "@/lib/utils";
import { Button } from "../ui/button";

export function PageNodeBuilder({
  elements,
  pageNode,
  workflow,
  setPageNode,
  pageNodes,
  conditions,
}: {
  elements: ElementInstance[];
  pageNode?: PageNode;
  workflow?: Workflow;
  setPageNode?: Dispatch<SetStateAction<PageNode>>;
  pageNodes?: PageNode[];
  conditions?: Condition[];
}) {
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

  const onSubmit: SubmitHandler<any> = (values) => {
    if (!pageNode || !workflow) return;
    const { nodes, edges } = workflow.buildConfig!;
    const edge = edges.find((e) => e.source === pageNode.id);
    const targetNode = nodes.find((n) => n.id === edge?.target);

    if (targetNode?.type === "pageNode") {
      const nextNode = pageNodes?.find((n) => n.id === targetNode.id);
      if (!nextNode) return;
      setPageNode?.(nextNode);
    }

    if (targetNode?.type === "branchNode") {
      const branchEdges = edges.filter((e) => e.source === targetNode.id);
      for (let i = 0; i < branchEdges.length; i++) {
        const branchEdge = branchEdges[i];
        const condition = conditions?.find((c) => c.edgeId === branchEdge.id);

        if (!condition || !condition.lhs) return;
        const variables = Object.keys(values);
        if (variables.includes(condition.lhs)) {
          const variable = variables.find((v) => v === condition.lhs);
          switch (condition.operator) {
            case "equals":
              if (String(values[variable!]) === condition.rhs) {
                const node = nodes.find((n) => n.id === branchEdge.target);
                const nextNode = pageNodes?.find((pn) => pn.id === node?.id);
                if (!nextNode) return;
                setPageNode?.(nextNode);
                return;
              }
          }
        }
      }
    }
  };

  const onPrev = () => {
    const edge = workflow?.buildConfig?.edges.find(
      (e) => e.target === pageNode?.id
    );
    const node = workflow?.buildConfig?.nodes.find(
      (n) => n.id === edge?.source
    );
    if (node?.type === "pageNode") {
      const prevNode = pageNodes?.find((n) => n.id === node.id);
      if (!prevNode) return;
      setPageNode?.(prevNode);
    }
  };

  return (
    <Form {...form}>
      <div className="w-full flex justify-between items-center">
        <Button variant="link" onClick={onPrev} className="pl-0">
          Prev
        </Button>
        <Button variant="link" onClick={form.handleSubmit(onSubmit)}>
          Next
        </Button>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
