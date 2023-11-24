"use client";

import { ColumnDef } from "@tanstack/react-table";

import { users } from "@/lib/schema";
import { UserAvatar } from "@/components/user-avatar";
import { md5 } from "js-md5";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export type User = typeof users.$inferSelect;

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("fullName") as string;
      const email = row.getValue("email") as string;
      return (
        <div className="flex gap-4 items-center">
          <UserAvatar
            src={`http://www.gravatar.com/avatar/${md5(email)}.jpg?d=retro`}
            className="md:h-6 md:w-6"
          />
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
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
      if (status === "accepted") {
        variant = "default";
      }

      if (status === "pending") {
        variant = "secondary";
      }

      if (status === "revoked") {
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
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return format(date, "yyyy-MM-dd");
    },
  },
  {
    id: "actions",
    header: "More",
    cell: ({ row }) => {
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
