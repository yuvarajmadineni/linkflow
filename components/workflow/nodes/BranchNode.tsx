import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Condition, cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { useWorkflow } from "@/hooks/use-undo-redo-nodes-store";
import {
  GitBranch,
  Link,
  MoreVertical,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import { deleteCondition } from "../_actions/delete-condition";
import {
  getAllPageNodeVariables,
  getAllParentNodesForNode,
} from "@/lib/workflow";
import { Badge } from "@/components/ui/badge";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCondition } from "../_actions/update-condition";

export function BranchNode(props: NodeProps) {
  const params = useParams();
  const { nodes, edges, update, pageNodes, conditions } = useWorkflow();
  const branchNodeConditions = conditions.filter(
    (c) => c.branchNodeId === props.id
  );
  const { setNodes, setEdges } = useReactFlow();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const allParentNodes = getAllParentNodesForNode(props.id, nodes, edges).map(
    (n) => n.id
  );
  const allParentPageNodes = pageNodes.filter((n) =>
    allParentNodes.includes(n.id)
  );

  let allVariables: string[] = [];
  let allVariableTypes: Record<string, string> = {};
  allParentPageNodes.forEach((page) => {
    const { variables, variableTypes } = getAllPageNodeVariables(page);
    allVariables = allVariables.concat(variables);
    allVariableTypes = { ...allVariableTypes, ...variableTypes };
  });

  async function addCondition() {
    setIsLoading(true);
    const res = await fetch(`/api/organization/workflow/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        nodeType: "pageNode",
        nodes,
        edges,
        nodeId: props.id,
      }),
    });

    if (res.ok) {
      toast({ title: "Succesfully added new condition" });
      const responseData = await res.json();
      setNodes(responseData.data.buildConfig.nodes);
      setEdges(responseData.data.buildConfig.edges);
      update(responseData.data.buildConfig);
      router.refresh();
    } else {
      toast({ title: `Something went wrong while adding a condition` });
    }
    setIsLoading(false);
  }

  return (
    <>
      <Sheet>
        <SheetTrigger onClick={router.refresh}>
          <Handle type="target" position={Position.Top} />
          <div className="rounded-full bg-secondary flex items-center gap-2 px-4 py-2 w-44 max-w-xl">
            <GitBranch className="h-4 w-4" />
            <div className="flex flex-col">
              <p className="text-base leading-tight">Output</p>
              <span className="text-xs text-muted-foreground">Branch node</span>
            </div>
          </div>
          <Handle type="source" position={Position.Bottom} />
        </SheetTrigger>
        <SheetContent className="flex flex-col justify-between overflow-y-scroll">
          <div className="flex flex-col gap-4">
            <SheetHeader>
              <SheetTitle className="flex gap-2">
                <GitBranch className="h-6 w-6" />
                <p className="capitalize">Branch node</p>
              </SheetTitle>
              <SheetDescription>ID {props.id}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    {"{i}"} {allVariables.length} variables available
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-3">
                    <p>
                      Simply drag variables into the required forms. You can
                      also begin typing to insert a variable with autocomplete
                    </p>
                    <div className="py-4 rounded-md bg-primary/10 px-2 flex gap-2">
                      {allVariables.map((value, i) => (
                        <Badge key={i} variant="lightsecondary">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {branchNodeConditions.map((c) => (
                <Condition
                  key={c.id}
                  targetId={c.edgeId}
                  workflowId={params.id as string}
                  variables={allVariables}
                  condition={c}
                  variableTypes={allVariableTypes}
                />
              ))}
            </div>
          </div>
          <SheetFooter className="sm:justify-start">
            <Button variant="ghost" onClick={addCondition} disabled={isLoading}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add condition
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

const Condition = ({
  workflowId,
  targetId,
  variables,
  condition,
  variableTypes,
}: {
  workflowId: string;
  targetId: string;
  variables: string[];
  variableTypes: Record<string, string>;
  condition: Condition;
}) => {
  const { setEdges, setNodes } = useReactFlow();
  const variableFields = variables.map((v) => ({ label: v, value: v }));
  const params = useParams();
  const operatorOptions = [
    "equals",
    "not equals",
    "greater than",
    "less than",
    "greater than or equals to",
    "less than or equals to",
    "starts with",
  ];

  const schema = z
    .object({
      lhs: z
        .string({ required_error: "variable field is required" })
        .refine((v) => variables.includes(v), {
          message: "Please select a variable from the list",
        }),
      rhs: z
        .string({ required_error: "Output check is required" })
        .min(1, { message: "Please add the output condition check" }),
      operator: z.enum(
        [
          "equals",
          "not equals",
          "greater than",
          "less than",
          "greater than or equals to",
          "less than or equals to",
          "starts with",
        ],
        {
          errorMap: () => {
            return {
              message: "Please select the condition from given condtions",
            };
          },
        }
      ),
    })
    .refine(
      (arg) => {
        const { lhs, rhs } = arg;
        const type = variableTypes[lhs];
        const getVarialbeTypes = (type: string) => {
          switch (type) {
            case "number":
              return z.coerce.number();
            case "boolean":
              return z.boolean();
            case "string":
              return z.string().trim().min(1);
            default:
              return z.string().trim().min(1);
          }
        };
        const schema = getVarialbeTypes(type);
        const validatedRhs = schema.safeParse(rhs);
        if (!validatedRhs.success) {
          return false;
        }
        return true;
      },
      {
        message: `Invalid Data type.Please use valid type which you have defined`,
        path: ["rhs"],
      }
    );

  type FormValues = z.infer<typeof schema>;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      lhs: condition.lhs || "",
      rhs: condition.rhs || "",
      operator: (condition.operator || "") as any,
    },
  });

  const lhsValue = form.getValues("lhs");
  const lhsErrorMsg = form.formState.errors.lhs?.message;

  const saveConditionChanges: SubmitHandler<FormValues> = async ({
    lhs,
    rhs,
    operator,
  }) => {
    try {
      await updateCondition({
        conditionId: condition.id,
        lhs,
        rhs,
        operator,
        workflowId: params.id as string,
      });
      toast({ title: "Changes saved sucessfully" });
    } catch (e) {
      toast({ title: "Failed to save the changes" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(saveConditionChanges)}>
        <div className="bg-primary/10 pb-4 px-3 flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label>IF</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        const updatedWorkflow = await deleteCondition({
                          workflowId,
                          targetId,
                          conditionId: condition.id,
                        });
                        setNodes(updatedWorkflow.buildConfig?.nodes!);
                        setEdges(updatedWorkflow.buildConfig?.edges!);
                        toast({ title: "Successfully deleted the condition" });
                      } catch (e) {
                        toast({ title: "Failed to delete the condition" });
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4 text-red-500" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-full">
                <SelectVariables variables={variableFields} lhs={lhsValue} />
                {lhsErrorMsg && (
                  <p className="text-destructive text-sm font-medium">
                    {lhsErrorMsg}
                  </p>
                )}
              </div>
              <Button variant="ghost">
                <Link className="h-4 w-4" />
              </Button>
            </div>
            <FormField
              name="operator"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={"Select the condtion"} />
                      </SelectTrigger>
                      <SelectContent>
                        {operatorOptions.map((op) => (
                          <SelectItem key={op} value={op}>
                            {op}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center">
              <FormField
                name="rhs"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} placeholder="Select output condition" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant="ghost">
                <Link className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              className="px-2"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              Save changes
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export function SelectVariables({
  variables,
  lhs,
}: {
  variables: {
    label: string;
    value: string;
  }[];
  lhs: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {lhs
            ? variables.find((variable) => variable.value === lhs)?.label
            : "Select variable"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <FormField
          name="lhs"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Command onValueChange={field.onChange}>
                  <CommandInput placeholder="Search variable" />
                  <CommandEmpty>No variable found.</CommandEmpty>
                  <CommandGroup>
                    {variables.map((variable) => (
                      <CommandItem
                        key={variable.value}
                        value={variable.value}
                        onSelect={(e) => {
                          field.onChange(e);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === variable.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {variable.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </FormControl>
            </FormItem>
          )}
        />
      </PopoverContent>
    </Popover>
  );
}
