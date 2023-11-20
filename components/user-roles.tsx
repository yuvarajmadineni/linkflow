"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"];

type Props = {
  showMobileRole: Checked;
  setShowMobileRole: React.Dispatch<React.SetStateAction<Checked>>;
  showWebRole: Checked;
  setShowWebRole: React.Dispatch<React.SetStateAction<Checked>>;
};

export function DropDownUserRoles({
  showMobileRole,
  setShowMobileRole,
  setShowWebRole,
  showWebRole,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Select Role</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Roles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showMobileRole}
          onCheckedChange={setShowMobileRole}
        >
          Mobile User
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showWebRole}
          onCheckedChange={setShowWebRole}
        >
          Web User
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
