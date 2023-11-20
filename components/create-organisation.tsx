"use client";
import { useOrganizationList } from "@clerk/nextjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useRouter } from "next/navigation";

const CreateOrganisation = () => {
  const { createOrganization, setActive } = useOrganizationList();
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(1, "Organisation name is required"),
  });
  const form = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (createOrganization) {
      const organisation = await createOrganization({ name: values.name });
      setActive({ organization: organisation });
      fetch("/api/organization", {
        method: "POST",
        body: JSON.stringify({
          organizationId: organisation.id,
          name: organisation.name,
        }),
      });
      router.replace("/dashboard");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Organisation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you want to create a new organisation?</DialogTitle>
          <DialogDescription>
            This action will establish a new organization, designating you as
            the administrator. If you have received an invitation for an
            existing organization, you can utilize that link to become a member.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        className="col-span-3"
                        placeholder="Enter Organisation name"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganisation;
