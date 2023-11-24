"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
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
import { useOrganization } from "@clerk/nextjs";
import { useToast } from "./ui/use-toast";
import { DropDownUserRoles } from "./user-roles";
import React, { useState } from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function AddUsers() {
  const [showMobileRole, setShowMobileRole] = React.useState<Checked>(true);
  const [showWebRole, setShowWebRole] = React.useState<Checked>(false);
  const [open, setOpen] = useState(false);
  const formSchema = z.object({
    email: z.string().email("This is not a valid email"),
    name: z.string().min(1, "Name is required"),
    phoneNumber: z
      .string()
      .min(10, "Phone number should contain 10 digits")
      .refine((val) => Number(val)),
  });
  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      phoneNumber: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { organization } = useOrganization();
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const member = await organization?.inviteMember({
        role: "basic_member",
        emailAddress: values.email,
      });

      let role = [];

      if (showMobileRole) {
        role.push("mobileuser");
      }

      if (showWebRole) {
        role.push("webuser");
      }

      const res = await fetch("/api/organization/user", {
        method: "POST",
        body: JSON.stringify({
          role,
          email: member?.emailAddress,
          id: member?.id,
          status: member?.status,
          phoneNumber: values.phoneNumber,
          name: values.name,
          organizationId: organization?.id,
        }),
      });

      if (res.ok) {
        toast({ title: "Successfully invited the user" });
      } else {
        toast({ title: "Inviting user failed" });
      }
      setOpen(false);
    } catch (e: any) {
      const title = e.errors[0].message as string;
      const description = e.errors[0].longMessage;
      toast({
        title: title.charAt(0).toUpperCase() + title.slice(1),
        description: description,
      });
    }
  };

  return (
    <Form {...form}>
      <form>
        <Sheet
          onOpenChange={() => {
            form.reset();
            setOpen((open) => !open);
          }}
          open={open}
        >
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
                        <Input
                          className="col-span-3"
                          id="email"
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-center">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Name</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          id="name"
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">
                        Mobile Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          id="phoneNumber"
                          placeholder={"9999934567"}
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
              <DropDownUserRoles
                showMobileRole={showMobileRole}
                showWebRole={showWebRole}
                setShowMobileRole={setShowMobileRole}
                setShowWebRole={setShowWebRole}
              />
            </div>
            <SheetFooter>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={form.formState.isSubmitting}
              >
                Invite User
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </form>
    </Form>
  );
}
