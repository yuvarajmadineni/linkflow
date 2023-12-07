import { TextFieldElement } from "./fields/TextField";

export type ElementsType = "TextField";

export type Element = {
  type: ElementsType;
  construct: (id: string) => ElementInstance;
  designerBtnElement: { icon: React.ElementType; label: string };
  designerComponent: React.FC;
  component: React.FC;
  propertiesComponent: React.FC;
};

export type ElementInstance = {
  id: string;
  type: ElementsType;
  extraAttributes: Record<string, any>;
};

type WorkflowComponentElementsType = {
  [key in ElementsType]: Element;
};

export const Elements: WorkflowComponentElementsType = {
  TextField: TextFieldElement,
};
