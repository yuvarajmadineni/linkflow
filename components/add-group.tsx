"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, cn, getUserAvatar } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { UserAvatar } from "./user-avatar";

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

  const [addedUsers, setAddedUsers] = useState([]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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

  return (
    <Form {...form}>
      <form>
        <Sheet
          onOpenChange={() => {
            form.reset();
            clearSearchParams();
          }}
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
                />
              </FormItem>
              <div
                className={cn("bg-muted  border border-r-8 ", {
                  "h-24 justify-center flex  items-center":
                    users.length === 0 || !searchTerm,
                })}
              >
                {users.length === 0 || !searchTerm ? (
                  <UsersIcon />
                ) : (
                  users.map((user) => (
                    <>
                      <ShowUser user={user} />
                    </>
                  ))
                )}
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox id="notify" />
                <label
                  htmlFor="notify"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                >
                  Send a notification to users added
                </label>
              </div>
              <Button onClick={form.handleSubmit(() => {})}>
                Create Group
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </form>
    </Form>
  );
}

const ShowUser = ({ user }: { user: User }) => {
  const [added, setAdded] = useState(false);
  const onAdd = () => {
    setAdded((add) => !add);
  };
  return (
    <div className="flex gap-4 items-center py-4 px-2 justify-between w-full">
      <div className="flex gap-2 items-center">
        <UserAvatar src={getUserAvatar(user.email)} className="md:h-8 md:w-8" />
        <span>{user.fullName}</span>
      </div>
      <Button
        className={cn("h-8", added && "bg-gray-200 dark:bg-gray-700")}
        onClick={onAdd}
        variant={added ? "secondary" : "default"}
      >
        {added ? "Remove" : "Add"}
      </Button>
    </div>
  );
};
