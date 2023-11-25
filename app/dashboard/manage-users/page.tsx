import { GroupList } from "@/components/group-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersList } from "@/components/users-list";
import { getAllUsers } from "@/lib/organization";

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
    <div className="px-8 py-8 flex flex-col gap-4">
      <h3 className="text-sm md:text-3xl font-semibold">User Management</h3>
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="space-x-4">
          <TabsTrigger value="users" className="px-8">
            Users
          </TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="flex flex-col gap-8">
          <UsersList searchParams={searchParams} usersData={data} />
        </TabsContent>
        <TabsContent value="groups">
          <GroupList users={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
