import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Workflow } from "@/lib/utils";

export default function WorkflowAction({ workflow }: { workflow: Workflow }) {
  return (
    <div className="container mx-auto px-4  py-6 md:px-6">
      <header className="py-2">
        <h3 className="text-2xl font-semibold">Assigned Workflows</h3>
      </header>
      <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle>{workflow.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{workflow.instructions}</p>
          </CardContent>
          <CardFooter className="justify-end">
            <Button>Start</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
