import { DataTable } from "@/app/dashboard/manage-users/data-table";
import { AddUsers } from "./add-users";
import { SearchIcon } from "lucide-react";
import { SearchValues } from "./search-values";
import { SelectItems } from "./select-items";
import { getAllUsers } from "@/lib/organization";
import { columns } from "@/app/dashboard/manage-users/usercolumns";
import { User } from "@/lib/utils";

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

export async function UsersList({
  searchParams,
  usersData,
}: {
  searchParams: { query?: string; role?: string };
  usersData: User[];
}) {
  return (
    <>
      <div className="flex gap-4">
        <SelectItems items={users} />
        <div className="relative flex justify-between w-full">
          <div>
            <SearchValues />
            <SearchIcon className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          <AddUsers />
        </div>
      </div>
      <DataTable data={usersData} columns={columns} />
    </>
  );
}
