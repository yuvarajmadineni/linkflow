"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { GroupIcon, UsersIcon } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, cn, getUserAvatar } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SetStateAction, useState } from "react";
import { UserAvatar } from "../user/user-avatar";
import { useOrganization } from "@clerk/nextjs";
import { toast } from "@/components/ui/use-toast";

export function AddGroup({ users }: { users: User[] }) {
  const schema = z.object({
    name: z.string().trim().min(1, "Group name is required"),
    description: z.string().trim().min(1, "Group description is required"),
  });
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: zodResolver(schema),
  });

  const [open, setOpen] = useState(false);
  const [addedUsers, setAddedUsers] = useState<User[]>([]);

  const { organization } = useOrganization();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, refresh } = useRouter();

  const searchTerm = searchParams.get("query");

  const handleChange = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const clearSearchParams = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSumbit = async (values: z.infer<typeof schema>) => {
    const { name, description } = values;

    const res = await fetch("/api/organization/group", {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        organizationId: organization?.id,
        users: addedUsers,
      }),
    });

    if (!res.ok) {
      toast({ title: "Failed to create group" });
      refresh();
    } else {
      toast({ title: "Successfully created the new group" });
      setOpen(false);
      clearSearchParams();
    }
  };

  return (
    <Form {...form}>
      <form>
        <Sheet
          onOpenChange={() => {
            form.reset();
            clearSearchParams();
            setAddedUsers([]);
            setOpen((open) => !open);
          }}
          open={open}
        >
          <SheetTrigger asChild>
            <Button className="space-x-2">
              <GroupIcon className="h-5 w-5" />
              <span>Create Group</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col gap-8 overflow-scroll">
            <SheetHeader>
              <SheetTitle className="capitalize text-muted-foreground">
                Create new group
              </SheetTitle>
              <SheetDescription>
                Create a new group and add required users
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Group name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
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
                    (users.length === 0 || !searchTerm) &&
                    addedUsers.length === 0,
                })}
              >
                {(users.length === 0 || !searchTerm) &&
                addedUsers.length === 0 ? (
                  <UsersIcon />
                ) : searchTerm ? (
                  users.map((user) => (
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
                Create Group
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </form>
    </Form>
  );
}

export const ShowUser = ({
  user,
  setAddedUsers,
  addedUsers,
}: {
  user: User;
  addedUsers: User[];
  setAddedUsers: React.Dispatch<SetStateAction<User[]>>;
}) => {
  const checkUserAdded = () => {
    return Boolean(addedUsers.find((u) => u.id === user.id));
  };

  const isAdded = checkUserAdded();
  const onAdd = () => {
    setAddedUsers((users) => {
      const checkUser = users.find((u) => u.id === user.id);
      if (checkUser) return users.filter((u) => u.id !== user.id);
      return users.concat(user);
    });
  };
  return (
    <div className="flex gap-4 items-center py-4 px-2 justify-between w-full">
      <div className="flex gap-2 items-center">
        <UserAvatar src={getUserAvatar(user.email)} className="md:h-8 md:w-8" />
        <span>{user.fullName}</span>
      </div>
      <Button
        className={cn("h-8", isAdded && "bg-gray-200 dark:bg-gray-700")}
        onClick={onAdd}
        variant={isAdded ? "secondary" : "default"}
      >
        {isAdded ? "Remove" : "Add"}
      </Button>
    </div>
  );
};
