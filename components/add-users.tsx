"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function AddUsers() {
  const formSchema = z.object({
    email: z.string().min(1, "Email is required"),
  });
  const form = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {};

  return (
    <Form {...form}>
      <form>
        <Sheet onOpenChange={() => form.reset()}>
          <SheetTrigger asChild>
            <Button className="space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Invite User</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="capitalize">Invite new user</SheetTitle>
              <SheetDescription>
                Invite a new user to the organisation and click invite when
                you&apos;re done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Email</FormLabel>
                      <FormControl>
                        <Input className="col-span-3" id="email" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter>
              <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                Invite User
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </form>
    </Form>
  );
}
