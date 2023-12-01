import { User } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useUsers(search?: string) {
  const { data: users, isLoading: isUsersDataLoading } = useQuery({
    queryKey: ["users", search],
    queryFn: () =>
      fetch(`/api/organization/users?search=${search}`)
        .then((res) => res.json())
        .then((res) => res.data as Promise<User[]>),
  });

  return { users, isUsersDataLoading };
}
