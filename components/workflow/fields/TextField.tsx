"use client";

import { Text } from "lucide-react";
import { Element, ElementsType } from "../workflow-components";

const type: ElementsType = "TextField";

export const TextFieldElement: Element = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes: {
      label: "Text Field",
      helperText: "Helper text",
      required: false,
      placeholder: "Value here",
    },
  }),
  designerBtnElement: { icon: Text, label: "Textfield" },
  designerComponent: () => <div>Designer component</div>,
  component: () => <div> component</div>,
  propertiesComponent: () => <div>Properties component</div>,
};
