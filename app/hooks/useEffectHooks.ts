/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { usePusher } from "../component/util_component/PusherProvider";
import { AuthUser, ChatsType, Message, SeenType } from "../types";

//-----------------------------------------------------------message panel effects start here--------------------------------------------------------------//
//👍 pusher subscribe for typing state ( whether the user typing or not state)
export function usePusherSubscribe(
  debounce: string,
  activeChat: ChatsType,
  authUser: AuthUser
) {
  const pusher = usePusher();

  useEffect(() => {
    if (!pusher || !activeChat?.chatId || !authUser?.uid) return;

    const channelName = `private-message-${activeChat?.chatId}`;

    const channel = pusher.channel(channelName);
    channel?.trigger("client-message", {
      type: "typing",
      userId: authUser?.uid,
      chatId: activeChat.chatId,
      isTyping: !!debounce?.length,
    });
  }, [debounce, pusher, activeChat?.chatId, authUser?.uid]);
}

//👍 update message seen
export function useUpdateMessageSeen(
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  activeChat: ChatsType,
  messageSeen: SeenType
) {
  useEffect(() => {
    if (!messageSeen?.receiverId || !activeChat?.chatId) return;

    setMessages((prev) =>
      prev.map((c) =>
        c.senderId === messageSeen?.senderId && c.chatId === activeChat?.chatId
          ? { ...c, status: "seen" }
          : c
      )
    );
  }, [messageSeen.state]);
}
//-----------------------------------------------------------message panel effects ends here-------------------------------------------------------------//

//-----------------------------------------------------------chat panel effects start here--------------------------------------------------------------//

//👍 update the ( increase ) the unread message count
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
          senderId: msg.senderId,
          status: msg.status,
          unreadCount: isMsgToMe
            ? []
            : activeChat?.chatId === chat?.chatId && chat.chatId === msg.chatId
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

//👍  stop update ( increase ) unread message if current chat is open
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

//---------------------------------------------------------message view area effects start here--------------------------------------------------------------//

//👍 update message seen
export function useMessageSeenAPI(
  isInView: boolean,
  lastMessage: Message,
  authUser: AuthUser,
  activeChat: ChatsType
) {
  //
  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.senderId === authUser?.uid) {
      return;
    }

    if (isInView && lastMessage?.status !== "seen") {
      const seenUpdate = async () => {
        const res = await fetch("/api/messages/message-seen", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: activeChat?.chatId,
            receiverId: authUser?.uid,
            senderId: lastMessage.senderId,
          }),
        });
        const result = await res.json();

        if (result && result.success) {
        }
      };
      seenUpdate();
    }
  }, [lastMessage, authUser?.uid]);
}
//---------------------------------------------------------message view area effects ends here--------------------------------------------------------------//
