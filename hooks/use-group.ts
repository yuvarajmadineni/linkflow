import { Group, User } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useGroup(groupId: string) {
  const {
    data: groupWithUsers,
    isLoading: isGroupLoading,
    error,
  } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () =>
      fetch(`/api/organization/group/${groupId}`)
        .then((res) => res.json())
        .then((r) => r.data as Promise<{ group: Group; users: User[] }>),
  });

  return {
    group: groupWithUsers?.group,
    isGroupLoading,
    error,
    users: groupWithUsers?.users,
  };
}
