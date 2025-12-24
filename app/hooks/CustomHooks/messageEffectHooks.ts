/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

import {
  AuthUser,
  ChatsType,
  GroupMessage,
  GroupType,
  Message,
  PusherChatDispatch,
  PusherChatState,
  SeenType,
} from "@/app/types";
import { useDispatch, useSelector } from "react-redux";
import { usePusher } from "@/app/component/util_component/PusherProvider";
import {
  setChatsArray,
  setGroupMessageSeen,
  setTypingUsers,
  setUnreads,
} from "@/app/lib/redux/chatslicer";
import { apiFetch } from "@/app/helper/helper";
import { useSocket } from "@/app/component/util_component/SocketProvider";
import { useLiveLink } from "@/app/context/LiveLinkContext";

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
      useFor: "typing",
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
  const dispatch = useDispatch<PusherChatDispatch>();

  useEffect(() => {
    if (!messageSeen?.receiverId || !activeChat?.chatId) return;
    dispatch(setUnreads(0));

    setMessages((prev) =>
      prev.map((c) =>
        c.senderId === messageSeen?.senderId && c.chatId === activeChat?.chatId
          ? { ...c, status: "seen" }
          : c
      )
    );
  }, [messageSeen.state]);
}

//---------------------------------------------------------message view area effects start here--------------------------------------------------------------//

//👍 update message seen
export function useMessageSeenAPI(
  isInView: boolean,
  lastMessage: Message,
  authUser: AuthUser,
  activeChat: ChatsType | GroupType,
  type?: string
) {
  const dispatch = useDispatch<PusherChatDispatch>();
  const socket = useSocket();
  const { countRef } = useLiveLink();

  const seenUpdate = async () => {
    if (!socket) return;
    const payload = {
      chatId: activeChat?.chatId,
      receiverId: authUser?.uid,
      senderId: lastMessage.senderId ?? lastMessage.senderInfo?.senderId,
      type,
      unreadCounts: countRef.current[activeChat?.chatId + "-" + authUser?.uid],
    };
    const api = type?.includes("Group")
      ? "/api/group/messages/message-seen"
      : "/api/messages/message-seen";
    const res = await apiFetch(api, "POST", payload);

    if (type?.includes("Group")) {
      socket?.emit("message-seen", payload);
    }
    const result = await res.json();
    if (result && result.success) {
    }
  };

  useEffect(() => {
    if (!lastMessage) {
      return;
    }
    if (
      lastMessage.senderId === authUser?.uid ||
      lastMessage.senderInfo?.senderId === authUser?.uid
    ) {
      return;
    }
    if (isInView && lastMessage?.status !== "seen") {
      dispatch(setUnreads(0));
      seenUpdate();
    }
  }, [lastMessage, authUser?.uid, isInView, socket]);
}
//---------------------------------------------------------message view area effects ends here--------------------------------------------------------------//

//-----------------------------------------------------------message panel effects ends here-------------------------------------------------------------//
export function useUpdateGroupMessageSeen(
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  activeChat: GroupType,
  messageSeen: SeenType[]
) {
  const dispatch = useDispatch<PusherChatDispatch>();
  const activeUsers = useSelector(
    (store: PusherChatState) => store.chat.activeUsers
  );
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.chatId !== activeChat.chatId) {
          return m;
        }
        //find which one should update
        const updatedSeenBy = m.seenBy?.map((s) => {
          const activeInChat = activeUsers.some((au) => au.userId === s.userId);
          const seensUpdate = messageSeen.find(
            (ms) => ms.receiverId === s.userId
          );
          if (seensUpdate) {
            return { ...s, status: activeInChat ? "seen" : "delivered" };
          }

          return s;
        });

        return { ...m, status: "seen", seenBy: updatedSeenBy };
      })
    );
    dispatch(setGroupMessageSeen(null));
  }, [messageSeen]);
}
