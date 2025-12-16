//-----------------------------------------------------------chat panel effects start here--------------------------------------------------------------//

import { AuthUser, ChatsType, Message, SeenType } from "@/app/types";
import { useEffect } from "react";

//👍 update the ( increase ) the unread message count
// update the chat states to latest message data coming from live socket ( pusher )
export function useUnreadCountIncrease(
  msg: Message,
  setChatState: React.Dispatch<React.SetStateAction<ChatsType[]>>,
  activeChat: ChatsType,
  authUser: AuthUser
) {
  useEffect(() => {
    if (!msg) return;

    setChatState((prev) =>
      prev.map((chat) => {
        if (chat.chatId !== msg.chatId) {
          return chat;
        }
        //check if live message ( msg ) is for me
        const isMsgToMe = msg.senderId === authUser?.uid;

        const previous =
          chat?.unreadCount?.find((u) => u.userId === authUser?.uid)?.count ||
          0;

        return {
          ...chat,
          lastMessage: msg.content,
          updatedAt: msg.createdAt,
          lastMessageId: msg.customId,
          senderId: msg.senderId,
          status: msg.status,
          unreadCount: isMsgToMe
            ? []
            : activeChat?.chatId === chat?.chatId &&
              activeChat?.chatId === msg.chatId
            ? []
            : [{ userId: authUser?.uid ?? " ", count: previous + 1 }],
        };
      })
    );
  }, [authUser?.uid, msg]);
}

//👍 clear count
export function useUnreadCountClear(
  setChatState: React.Dispatch<React.SetStateAction<ChatsType[]>>,
  activeChat: ChatsType,
  authUser: AuthUser
) {
  useEffect(() => {
    if (!activeChat?.chatId || !authUser?.uid) return;

    setChatState((prev) =>
      prev.map((chat) => {
        if (chat.chatId !== activeChat?.chatId) return chat;

        return {
          ...chat,
          unreadCount: chat.unreadCount?.map((c) =>
            c.userId === authUser?.uid ? { ...c, count: 0 } : c
          ),
        };
      })
    );
  }, [activeChat?.chatId, authUser?.uid]);
}

//👍  stop update ( increase ) unread message if current chat is open //
// update the chat states to latest message data coming from live socket ( pusher )
export function useUnreadCountStop(
  msg: Message,
  setChatState: React.Dispatch<React.SetStateAction<ChatsType[]>>,
  activeChat: ChatsType
) {
  useEffect(() => {
    if (!msg) return;

    setChatState((prev) =>
      prev.map((chat) => {
        if (activeChat?.chatId === chat?.chatId && chat.chatId === msg.chatId)
          return {
            ...chat,
            lastMessage: msg.content,
            lastMessageId: msg.customId,
            updatedAt: msg.createdAt,
            senderId: msg.senderId,
            status: msg.status,
            unreadCount: [],
          };
        return chat;
      })
    );
  }, [activeChat?.chatId, msg]);
}

//👍 update message seen status ( in this case last messagee status of chat)
export function useUpdateMessageSeenInChat(
  setChatState: React.Dispatch<React.SetStateAction<ChatsType[]>>,
  messageSeen: SeenType
) {
  //
  useEffect(() => {
    if (!messageSeen.chatId) return;

    setChatState((prev) =>
      prev.map((c) =>
        c.chatId === messageSeen?.chatId ? { ...c, status: "seen" } : c
      )
    );
  }, [messageSeen.state]);
}

//-----------------------------------------------------------chat panel effects ends here--------------------------------------------------------------//
