import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyWorkflow } from "../../../components/workflow/empty-worflow";
import { getWorkflows } from "@/lib/organization";
import { WorkflowList } from "@/components/workflow/workflow-list";
import { cn } from "@/lib/utils";
import { CreateWorkflow } from "@/components/workflow/create-workflow";

export default async function Workflow() {
  const workflows = await getWorkflows();
  const draftWorkflows = workflows.filter(
    (workflow) => workflow.status === "draft"
  );
  const publishedWorkflows = workflows.filter(
    (workflow) => workflow.status === "published"
  );
  const archivedWorkflows = workflows.filter(
    (workflow) => workflow.status === "archived"
  );
  return (
    <div className="px-8 py-8 flex flex-col gap-4 h-full">
      <div className="flex justify-between">
        <h3 className="text-3xl font-semibold">Workflow</h3>
        <CreateWorkflow />
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
            "h-full": workflows.length === 0,
            "grid grid-flow-row gap-4 sm:grid-col-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6":
              workflows.length > 0,
          })}
        >
          {workflows.length === 0 ? (
            <EmptyWorkflow />
          ) : (
            <WorkflowList workflows={workflows} />
          )}
        </TabsContent>
        <TabsContent
          value="published"
          className={cn({
            "h-full": publishedWorkflows.length === 0,
            "grid grid-flow-row gap-4 sm:grid-col-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6":
              publishedWorkflows.length > 0,
          })}
        >
          {workflows.length === 0 ? (
            <EmptyWorkflow />
          ) : (
            <WorkflowList workflows={publishedWorkflows} />
          )}
        </TabsContent>
        <TabsContent
          value="draft"
          className={cn({
            "h-full": draftWorkflows.length === 0,
            "grid grid-flow-row gap-4 sm:grid-col-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6":
              draftWorkflows.length > 0,
          })}
        >
          {workflows.length === 0 ? (
            <EmptyWorkflow />
          ) : (
            <WorkflowList workflows={draftWorkflows} />
          )}
        </TabsContent>
        <TabsContent
          value="archived"
          className={cn({
            "h-full": archivedWorkflows.length === 0,
            "grid grid-flow-row gap-4 sm:grid-col-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6":
              archivedWorkflows.length > 0,
          })}
        >
          {workflows.length === 0 ? (
            <EmptyWorkflow />
          ) : (
            <WorkflowList workflows={archivedWorkflows} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
