"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Group, getUserAvatar } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { User } from "./usercolumns";
import { Checkbox } from "@/components/ui/checkbox";
import { UserAvatar } from "@/components/user-avatar";

export const columns: ColumnDef<Group & { users: User[] }>[] = [
  {
    id: "checkbox",
    cell: () => {
      return <Checkbox id="checkbox" />;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-px-4"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "users",
    header: "Members",
    cell: ({ row }) => {
      const members = row.getValue("users") as User[];
      return (
        <div className="flex">
          {members?.slice(0, 4).map((mem) => (
            <UserAvatar
              src={getUserAvatar(mem.email)}
              className="md:h-5 md:w-5 md:-mr-2"
            />
          ))}
          {members.length > 4 && (
            <UserAvatar
              name={`+${members.length - 4}`}
              className="md:h-5 md:w-5 md:-mr-2"
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return <span className="ml-4">{format(date, "yyyy-MM-dd")}</span>;
    },
  },
  {
    id: "actions",
    header: "More",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <span className="sr-only">Open menu</span>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Groups</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
