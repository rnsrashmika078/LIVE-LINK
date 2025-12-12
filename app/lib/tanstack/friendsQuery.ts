/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  addFriend,
  findFriend,
  getLastSeenUpdate,
  getReceivedRequests,
  getSendRequests,
  getUserFriends,
  lastSeenUpdate,
  sendRequest,
} from "@/app/actions/friends_server_action";
import { AuthUser } from "@/app/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useSearchFriend(searchParam: string, userId: string) {
  return useQuery({
    queryKey: ["find-friend", searchParam, userId],
    queryFn: () => findFriend(searchParam, userId),
    enabled: !!searchParam,
    refetchOnWindowFocus: false,
  });
}
export function useSendFriendRequests() {
  return useMutation({
    mutationFn: ({
      requestSender,
      requestReceiver,
    }: {
      requestSender: AuthUser;
      requestReceiver: AuthUser;
    }) => sendRequest(requestSender, requestReceiver),
  });
}
export function useAddFriend() {
  return useMutation({
    mutationFn: ({ user, friend }: { user: AuthUser; friend: AuthUser }) =>
      addFriend(user, friend),
  });
}
export function useGetSendRequests(userId: string) {
  return useQuery({
    queryKey: ["get-send-requests", userId],
    queryFn: () => getSendRequests(userId),
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
}
export function useReceivedRequest(userId: string) {
  return useQuery({
    queryKey: ["get-received-requests", userId],
    queryFn: () => getReceivedRequests(userId),
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
}
export function useGetFriends(userId: string, openModal: boolean) {
  return useQuery({
    queryKey: ["get-friends", userId],
    queryFn: () => getUserFriends(userId),
    enabled: openModal,
    refetchOnWindowFocus: false,

  });
}
export function useUpdateLastSeen(onSuccess?: (result: any) => void) {
  return useMutation({
    mutationFn: ({ uid, lastSeen }: { uid: string; lastSeen: string }) =>
      lastSeenUpdate(uid, lastSeen),
    onSuccess,
  });
}
export function useGetLastSeen(uid: string) {
  return useQuery({
    queryKey: ["get-last-seen", uid],
    queryFn: () => getLastSeenUpdate(uid),
    refetchOnWindowFocus: false,
    enabled: !!uid,
  });
}
