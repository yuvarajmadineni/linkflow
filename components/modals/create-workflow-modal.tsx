import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

export function CreateWorkflowModal() {
  const schema = z.object({
    name: z.string().min(1, "Worfklow name is required"),
    instructions: z.string().min(1, "Should provide instructions for workflow"),
  });
  const form = useForm({
    defaultValues: { name: "", instructions: "" },
    resolver: zodResolver(schema),
  });

  const { isOpen, onClose, type } = useModal();
  const isModalOpen = type === "createworkflow" && isOpen;
  const { refresh } = useRouter();

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const { name, instructions } = values;

    const res = await fetch("/api/organization/workflow", {
      method: "POST",
      body: JSON.stringify({ name, instructions, status: "draft" }),
    });

    if (!res.ok) {
      toast({ title: "Failed to create workflow", variant: "destructive" });
    } else {
      toast({ title: "Succesfully created the workflow" });
    }
    refresh();
    handleClose();
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="py-10 space-y-4">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">
            Great! Let’s lay some groundworks
          </DialogTitle>
          <DialogDescription className="text-center">
            Give your workflow a name and some instructions you want
            participants to follow
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workflow Name</FormLabel>
                  <FormControl className="bg-secondary">
                    <Input {...field} disabled={form.formState.isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl className="bg-secondary">
                    <Textarea
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="md:flex md:justify-between w-full">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="border-primary border"
            disabled={form.formState.isSubmitting}
          >
            Skip
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
          >
            Launch Workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
