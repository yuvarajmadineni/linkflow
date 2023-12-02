import { CreateTask } from "@/components/task/create-task";
import { EmptyTask } from "@/components/task/empty-task";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Task() {
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
        <TabsContent value="all">
          <EmptyTask />
        </TabsContent>
        <TabsContent value="published">
          <EmptyTask />
        </TabsContent>
        <TabsContent value="draft">
          <EmptyTask />
        </TabsContent>
        <TabsContent value="archived">
          <EmptyTask />
        </TabsContent>
      </Tabs>
    </div>
  );
}
