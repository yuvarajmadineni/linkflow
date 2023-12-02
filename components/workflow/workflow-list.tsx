import { Workflow } from "@/lib/utils";
import { WorkflowCard } from "./workflow-card";

export function WorkflowList({ workflows }: { workflows: Workflow[] }) {
  return workflows.map((workflow) => (
    <WorkflowCard workflow={workflow} key={workflow.id} />
  ));
}
