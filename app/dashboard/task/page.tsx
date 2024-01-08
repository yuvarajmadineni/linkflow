import { CreateTask } from "@/components/task/create-task";
import { EmptyTask } from "@/components/task/empty-task";
import { TaskCard } from "@/components/task/task-card";
import { TaskList } from "@/components/task/task-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllTasks } from "@/lib/organization";
import { cn } from "@/lib/utils";

export default async function Task() {
  const tasks = await getAllTasks();
  const drafttasks = tasks.filter(({ task }) => task.status === "draft");
  const publishedtasks = tasks.filter(
    ({ task }) => task.status === "published"
  );
  const archivedtasks = tasks.filter(({ task }) => task.status === "archived");
  return (
    <div className="px-8 py-8 flex flex-col gap-4 h-full">
      <div className="flex justify-between">
        <h3 className="text-3xl font-semibold">Task Pipeline</h3>
        <CreateTask />
      </div>
      <Tabs defaultValue="all" className="h-full space-y-8">
        <TabsList className="space-x-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent
          value="all"
          className={cn({
            "h-full": tasks.length === 0,
            "grid grid-flow-row gap-4 sm:grid-col-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6":
              tasks.length > 0,
          })}
        >
          {tasks.length === 0 ? <EmptyTask /> : <TaskList tasks={tasks} />}
        </TabsContent>
        <TabsContent
          value="published"
          className={cn({
            "h-full": publishedtasks.length === 0,
            "grid grid-flow-row gap-4 sm:grid-col-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6":
              tasks.length > 0,
          })}
        >
          {tasks.length === 0 ? (
            <EmptyTask />
          ) : (
            <TaskList tasks={publishedtasks} />
          )}
        </TabsContent>
        <TabsContent
          value="draft"
          className={cn({
            "h-full": tasks.length === 0,
            "grid grid-flow-row gap-4 sm:grid-col-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6":
              drafttasks.length > 0,
          })}
        >
          {tasks.length === 0 ? <EmptyTask /> : <TaskList tasks={drafttasks} />}
        </TabsContent>
        <TabsContent
          value="archived"
          className={cn({
            "h-full": tasks.length === 0,
            "grid grid-flow-row gap-4 sm:grid-col-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6":
              archivedtasks.length > 0,
          })}
        >
          {tasks.length === 0 ? (
            <EmptyTask />
          ) : (
            <TaskList tasks={archivedtasks} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
