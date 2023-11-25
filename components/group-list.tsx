import { ListIcon, SearchIcon } from "lucide-react";
import { AddGroup } from "./add-group";
import { SearchValues } from "./search-values";
import { Button } from "./ui/button";
import { User } from "@/lib/utils";

export function GroupList({ users }: { users: User[] }) {
  return (
    <>
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
    </>
  );
}
