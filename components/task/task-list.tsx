import { Task, User, Workflow } from "@/lib/utils";
import { TaskCard } from "./task-card";

export function TaskList({
  tasks,
}: {
  tasks: { task: Task; users: User; workflows: Workflow }[];
}) {
  return tasks.map(({ task, workflows, users }) => (
    <TaskCard task={task} workflow={workflows} user={users} />
  ));
}
