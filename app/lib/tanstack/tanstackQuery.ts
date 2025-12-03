"use client";

import {
  addFriend,
  findFriend,
  getChats,
  getMessages,
  getReceivedRequests,
  getSendRequests,
  getUserFriends,
  saveMessages,
  sendRequest,
} from "@/app/actions/server_action";
import { AuthUser } from "@/app/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useSearchFriend(searchParam: string, userId: string) {
  return useQuery({
    queryKey: ["find-friend", searchParam, userId],
    queryFn: () => findFriend(searchParam, userId),
    enabled: !!searchParam,
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
    enabled: !!userId,
  });
}
export function useReceivedRequest(userId: string) {
  return useQuery({
    queryKey: ["get-received-requests", userId],
    queryFn: () => getReceivedRequests(userId),
    enabled: !!userId,
  });
}
export function useGetFriends(userId: string) {
  return useQuery({
    queryKey: ["get-friends", userId],
    queryFn: () => getUserFriends(userId),
    enabled: !!userId,
  });
}

//chats related query functions

export function useGetChats(uid: string) {
  return useQuery({
    queryKey: ["get-chats", uid],
    queryFn: () => getChats(uid),
    enabled: !!uid,
    refetchOnWindowFocus: false,
  });
}

export function useGetMessages(chatId: string) {
  return useQuery({
    queryKey: ["get-messages", chatId],
    queryFn: () => getMessages(chatId),
    enabled: !!chatId,
    refetchOnWindowFocus: false,
  });
}
interface SaveMessagePayload {
  content: string;
  senderId: string;
  receiverId: string;
  chatId: string;
}

//save -messages
export function useSaveMessage() {
  return useMutation({
    mutationFn: ({
      content,
      senderId,
      receiverId,
      chatId,
    }: SaveMessagePayload) =>
      saveMessages(content, senderId, receiverId, chatId),
  });
}
