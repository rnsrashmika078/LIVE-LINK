/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  deleteMessage,
  getMessages,
  saveMessages,
} from "@/app/actions/message_server_action";
import { SaveMessagePayload } from "@/app/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetMessages(chatId: string) {
  return useQuery({
    queryKey: ["get-messages", chatId],
    queryFn: () => getMessages(chatId),
    enabled: !!chatId,
    refetchOnWindowFocus: false,
  });
}
export function useSaveMessage(onSuccess?: (result: any) => void) {
  return useMutation({
    mutationFn: ({
      content,
      senderId,
      receiverId,
      chatId,
      name,
      dp,
      createdAt,
      customId,
      status,
      files,
      unreads,
    }: SaveMessagePayload) =>
      saveMessages(
        content,
        senderId,
        receiverId,
        chatId,
        name,
        dp,
        createdAt,
        customId,
        status,
        files,
        unreads
      ),
    onSuccess,
  });
}
export function useMessageDelete(onSuccess?: (result: any) => void) {
  return useMutation({
    mutationFn: ({
      messageId,
      public_id,
      chatId,
    }: {
      messageId: string;
      public_id?: string;
      chatId?: string;
    }) => deleteMessage(messageId, public_id ?? "", chatId ?? ""),
    onSuccess,
  });
}
