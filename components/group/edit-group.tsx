"use client";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUsers } from "@/hooks/use-users";
import { User, cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ShowUser } from "./add-group";
import { useGroup } from "@/hooks/use-group";
import { useQueryClient } from "@tanstack/react-query";

export function EditGroup({
  groupId,
  setAddedUsers,
  setOpen,
  addedUsers,
  open,
}: {
  groupId: string;
  addedUsers: User[];
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  setAddedUsers: React.Dispatch<SetStateAction<User[]>>;
  open: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { users } = useUsers(searchTerm);
  const { group, users: groupUsers } = useGroup(groupId);
  const queryClient = useQueryClient();
  const schema = z.object({
    name: z.string().trim().min(1, "Group name is required"),
    description: z.string().trim().min(1, "Group description is required"),
  });
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    values: {
      name: group?.name as string,
      description: group?.description as string,
    },
    resolver: zodResolver(schema),
  });

  const { refresh } = useRouter();

  const handleChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleSumbit = async (values: z.infer<typeof schema>) => {
    const { name, description } = values;

    const res = await fetch(`/api/organization/group/${groupId}`, {
      method: "PATCH",
      body: JSON.stringify({ name, description, users: addedUsers }),
    });

    if (!res.ok) {
      toast({ title: "Failed to update group" });
    } else {
      toast({ title: "Successfully updated the  group" });
      setOpen(false);
      refresh();
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    }
  };

  useEffect(
    function () {
      if (groupUsers && addedUsers.length === 0 && open)
        setAddedUsers(groupUsers);
    },
    [groupUsers, open]
  );

  return (
    <Form {...form}>
      <form>
        <SheetContent className="flex flex-col gap-8 overflow-scroll">
          <SheetHeader>
            <SheetTitle className="capitalize text-muted-foreground">
              Update group
            </SheetTitle>
            <SheetDescription>
              Update the existing group and add required users
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Group name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={form.formState.isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter group description here"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem className="space-y-4">
              <FormLabel>Add users</FormLabel>
              <p className="text-sm text-muted-foreground">
                Invite existing users to this group
              </p>
              <Input
                placeholder="Search existing users"
                onChange={(e) => handleChange(e.target.value)}
                disabled={form.formState.isSubmitting}
              />
            </FormItem>
            <div
              className={cn("bg-muted  border border-r-8 ", {
                "h-24 justify-center flex  items-center":
                  (users?.length === 0 || !searchTerm) &&
                  addedUsers.length === 0,
              })}
            >
              {(users?.length === 0 || !searchTerm) &&
              addedUsers.length === 0 ? (
                <UsersIcon />
              ) : searchTerm ? (
                users?.map((user) => (
                  <>
                    <ShowUser
                      user={user}
                      addedUsers={addedUsers}
                      setAddedUsers={setAddedUsers}
                    />
                  </>
                ))
              ) : (
                addedUsers.map((user) => (
                  <ShowUser
                    user={user}
                    addedUsers={addedUsers}
                    setAddedUsers={setAddedUsers}
                  />
                ))
              )}
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox id="notify" disabled={form.formState.isSubmitting} />
              <label
                htmlFor="notify"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
              >
                Send a notification to users added
              </label>
            </div>
          </div>
          <SheetFooter>
            <Button
              onClick={form.handleSubmit(handleSumbit)}
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </form>
    </Form>
  );
}
