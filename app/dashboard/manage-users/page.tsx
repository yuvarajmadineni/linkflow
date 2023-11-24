import { AddUsers } from "@/components/add-users";
import { SearchUsers } from "@/components/search-users";
import { SelectItems } from "@/components/select-items.";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllUsers } from "@/lib/organization";
import { SearchIcon } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const users = [
  {
    label: "All Users",
    value: "allusers",
  },
  {
    label: "Web Users",
    value: "webuser",
  },
  {
    label: "Mobile Users",
    value: "mobileuser",
  },
];

export default async function ManageUsers({
  searchParams,
}: {
  searchParams: { query?: string; role?: string };
}) {
  const data = await getAllUsers(
    searchParams.query || "",
    searchParams.role !== "allusers"
      ? (searchParams.role as "admin" | "webuser" | "mobileuser")
      : undefined
  );
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
        <TabsContent value="users" className="flex flex-col gap-8">
          <div className="flex gap-4">
            <SelectItems items={users} />
            <div className="relative flex justify-between w-full">
              <div>
                <SearchUsers />
                <SearchIcon className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
              </div>
              <AddUsers />
            </div>
          </div>
          <DataTable data={data} columns={columns} />
        </TabsContent>
        <TabsContent value="groups">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
