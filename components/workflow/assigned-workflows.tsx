import { getUserAssignedWorkflows } from "@/lib/organization";
import WorkflowAction from "./workflow-action";

export async function AssignedWorkflows() {
  const userWorkflows = await getUserAssignedWorkflows();
  return userWorkflows.map((w) => (
    <WorkflowAction workflow={w.workflows} key={w.workflows.id} />
  ));
}
