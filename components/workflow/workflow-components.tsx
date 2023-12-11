import { ControllerRenderProps } from "react-hook-form";
import { ButtonElement } from "./fields/Button";
import { SelectFieldElement } from "./fields/Select";
import { SeperatorFieldElement } from "./fields/SeperatorField";
import { SpacerFieldElement } from "./fields/SpacerField";
import { SwitchElement } from "./fields/Switch";
import { TextElement } from "./fields/Text";
import { TextFieldElement } from "./fields/TextField";

export type ElementsType =
  | "TextField"
  | "Text"
  | "SeperatorField"
  | "SpacerField"
  | "SwitchField"
  | "ButtonField"
  | "SelectField";

export type Element = {
  type: ElementsType;
  construct: (id: string) => ElementInstance;
  designerBtnElement: { icon: React.ElementType; label: string };
  designerComponent: React.FC<{ elementInstance: ElementInstance }>;
  component: React.FC<{ elementInstance: ElementInstance }>;
  propertiesComponent: React.FC<{ elementInstance: ElementInstance }>;
  pageComponent?: React.FC<{ elementInstance: ElementInstance , field: ControllerRenderProps<any>}>;
};

export type ElementInstance = {
  id: string;
  type: ElementsType;
  extraAttributes?: Record<string, any>;
};

type WorkflowComponentElementsType = {
  [key in ElementsType]: Element;
};

export const Elements: WorkflowComponentElementsType = {
  TextField: TextFieldElement,
  Text: TextElement,
  SeperatorField: SeperatorFieldElement,
  SpacerField: SpacerFieldElement,
  SwitchField: SwitchElement,
  ButtonField: ButtonElement,
  SelectField: SelectFieldElement,
};
