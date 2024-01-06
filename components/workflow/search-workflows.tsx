"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Workflow, cn } from "@/lib/utils";
import { useState } from "react";

export function SearchWorkflows({ workflows }: { workflows: Workflow[] }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded="true"
          className="w-full justify-between"
        >
          {value
            ? workflows.find((workflow) => workflow.id === value)?.name
            : "Select workflow"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command onValueChange={() => {}}>
          <CommandInput placeholder="Search workflow" />
          <CommandEmpty>No workflow found.</CommandEmpty>
          <CommandGroup>
            {workflows.map((workflow) => (
              <CommandItem
                key={workflow.id}
                value={workflow.id}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === workflow.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {workflow.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
