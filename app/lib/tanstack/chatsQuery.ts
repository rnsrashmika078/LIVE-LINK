"use client";

import { getChats } from "@/app/actions/chats_server_actions";
import { useQuery } from "@tanstack/react-query";

export function useGetChats(uid: string, fetch: boolean) {
  return useQuery({
    queryKey: ["get-chats", uid],
    queryFn: () => getChats(uid),
    enabled: fetch,
    // refetchOnWindowFocus: false,
  });
}
