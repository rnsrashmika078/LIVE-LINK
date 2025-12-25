/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { ChatsType, DeletedMessage, Message } from "../types";

export const useDeleteMessage = (
  useFor: "Chat" | "Message",
  deleteMessages: DeletedMessage[],
  callback: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const deleteMap = new Map(
    deleteMessages.map((d) => [`${d.messageId}_${d.chatId}`, true])
  );

  useEffect(() => {
    try {
      if (!useFor) return;

      if (useFor === "Chat") {
        callback((prev: ChatsType[]) =>
          prev.map((m) => {
            const key = `${m.lastMessageId}_${m.chatId}`;
            if (!deleteMap.has(key)) return m;

            const message_structure = `{"url": "","message": "🚫This message was deleted","name": "","format": "","public_id": ""}`;

            return { ...m, lastMessage: message_structure };
          })
        );
      } else if (useFor === "Message") {
        callback((prev: Message[]) =>
          prev.map((m) => {
            const key = `${m.customId}_${m.chatId}`;
            if (!deleteMap.has(key)) return m;

            const message_structure = `{"url": "","message": "🚫This message was deleted","name": "","format": "","public_id": ""}`;

            return { ...m, content: message_structure };
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  }, [deleteMessages]);
};
