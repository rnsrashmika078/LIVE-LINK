"use client";

import { addNewFriend, findFriend } from "@/app/actions/server_action";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useSearchFriend(searchParam: string, userId: string) {
  return useQuery({
    queryKey: ["find-friend", searchParam, userId],
    queryFn: () => findFriend(searchParam, userId),
    enabled: !!searchParam,
  });
}
export function useAddFriend(searchParam: string) {
  return useMutation({
    mutationFn: () => addNewFriend(searchParam),
  });
}
