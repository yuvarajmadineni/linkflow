import { ListIcon, SearchIcon } from "lucide-react";
import { AddGroup } from "./add-group";
import { SearchValues } from "../search-values";
import { Button } from "../ui/button";
import { Group, User, UserGroup } from "@/lib/utils";
import { DataTable } from "@/app/dashboard/manage-users/data-table";
import { columns } from "@/app/dashboard/manage-users/groupcolumns";

export function GroupList({
  users,
  groupUsers,
}: {
  users: User[];
  groupUsers: Array<{
    groups: Group | null;
    users: User[];
  }>;
}) {
  const formatGroupUsers = groupUsers.map((groupUser) => ({
    ...groupUser.groups,
    users: groupUser.users,
  }));
  return (
    <div className=" flex flex-col gap-6">
      <div className="relative flex justify-between w-full">
        <div>
          <SearchValues placeholder="Search by group name" />
          <SearchIcon className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex gap-4 items-center">
          <Button variant="ghost">
            <ListIcon />
          </Button>
          <AddGroup users={users} />
        </div>
      </div>
      <DataTable
        columns={columns as Array<Group & { users: User[] }>}
        data={formatGroupUsers}
      />
    </div>
  );
}
