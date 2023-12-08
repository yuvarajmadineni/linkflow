"use client";

import { DesignerContext } from "@/components/providers/designer-provider";
import { useContext } from "react";

export function useDesigner() {
  const context = useContext(DesignerContext);

  if (!context)
    throw new Error("useDesigner should be used within designer context");

  return context;
}
