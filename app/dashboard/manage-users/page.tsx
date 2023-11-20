import { AddUsers } from "@/components/add-users";
import { SelectItems } from "@/components/select-items.";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon } from "lucide-react";

const users = [
  {
    label: "All Users",
    value: "all-users",
  },
  {
    label: "Web Users",
    value: "web-users",
  },
  {
    label: "Mobile Users",
    value: "mobile-users",
  },
];

export default function ManageUsers() {
  return (
    <div className="px-12 py-12 flex flex-col gap-4">
      <h3 className="text-sm md:text-3xl font-semibold">User Management</h3>
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="space-x-4">
          <TabsTrigger value="users" className="px-8">
            Users
          </TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <div className="flex gap-4">
            <SelectItems items={users} />
            <div className="relative flex justify-between w-full">
              <div>
                <Input className="border-gray-600 focus:border-background w-[320px] px-10" />
                <SearchIcon className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
              </div>
              <AddUsers />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="groups">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
