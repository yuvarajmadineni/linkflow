"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { Group, getUserAvatar } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowUpDown,
  Edit,
  MinusCircle,
  MoreVertical,
  PauseCircle,
  Trash2,
} from "lucide-react";
import { User } from "./usercolumns";

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
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      if (!status) return "";
      let variant:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | null
        | undefined;
      if (status === "active") {
        variant = "default";
      }

      if (status === "inactive") {
        variant = "secondary";
      }

      if (status === "suspended") {
        variant = "destructive";
      }
      return (
        <Badge variant={variant}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
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
            <DropdownMenuItem>
              <div className="flex gap-2">
                <Edit className="h-4 w-4" />
                <span>Edit group</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex gap-2">
                <PauseCircle className="h-4 w-4" />
                <span>Suspend group</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex gap-2">
                <MinusCircle className="h-4 w-4" />
                <span>Deactivate group</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex gap-2 text-red-500">
                <Trash2 className="h-4 w-4" />
                <span>Delete group</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
