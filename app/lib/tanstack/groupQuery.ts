/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createGroup,
  getGroups,
  sendMessage,
} from "@/app/actions/group_action";
import { GroupMessage, GroupType } from "@/app/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreateGroup(onSuccess?: (result: any) => void) {
  return useMutation({
    mutationFn: ({ groupData }: { groupData: GroupType }) =>
      createGroup(groupData),
    onSuccess,
  });
}
export function useSendGroupMessage(onSuccess?: (result: any) => void) {
  return useMutation({
    mutationFn: ({ message }: { message: GroupMessage }) =>
      sendMessage(message),
    onSuccess,
  });
}
export function useGetGroups(uid: string, connection: boolean) {
  return useQuery({
    queryKey: ["get-groups", uid],
    queryFn: () => getGroups(uid),
    enabled: !!uid || connection,
    refetchOnWindowFocus: false,
  });
}
