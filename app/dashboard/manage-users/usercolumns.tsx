/* eslint-disable react-hooks/rules-of-hooks */
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
import { UserAvatar } from "@/components/user/user-avatar";
import { useModal } from "@/hooks/use-modal-store";
import { users } from "@/lib/schema";
import { getUserAvatar } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowUpDown,
  CircleSlash,
  MoreVertical,
  PauseCircle,
  Trash2,
} from "lucide-react";

export type User = typeof users.$inferSelect;

export const columns: ColumnDef<User>[] = [
  {
    id: "checkbox",
    cell: () => {
      return <Checkbox id="checkbox" />;
    },
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("fullName") as string;
      const email = row.getValue("email") as string;
      return (
        <div className="flex gap-4 items-center">
          <UserAvatar src={getUserAvatar(email)} className="md:h-6 md:w-6" />
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
        | "suspend"
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

      if (status === "suspended") {
        variant = "suspend";
      }

      if (status === "deactivated") {
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
    cell: ({ row }) => {
      const { onOpen } = useModal();
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
            <DropdownMenuItem
              onClick={() => {
                onOpen("suspenduser", { user: row.original });
              }}
            >
              <div className="flex gap-2">
                <PauseCircle className="h-4 w-4" />
                <span>Suspend User</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onOpen("deactivateuser", { user: row.original })}
            >
              <div className="flex gap-2">
                <CircleSlash className="h-4 w-4" />
                <span>Block User</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onOpen("deleteuser", { user: row.original })}
            >
              <div className="flex gap-2 text-red-500">
                <Trash2 className="h-4 w-4" />
                <span>Delete User</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
