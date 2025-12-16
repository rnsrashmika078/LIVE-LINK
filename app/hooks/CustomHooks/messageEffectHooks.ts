/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

import {
  AuthUser,
  ChatsType,
  Message,
  PusherChatDispatch,
  SeenType,
} from "@/app/types";
import { useDispatch } from "react-redux";
import { usePusher } from "@/app/component/util_component/PusherProvider";
import { setUnreads } from "@/app/lib/redux/chatslicer";

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
  activeChat: ChatsType
) {
  const dispatch = useDispatch<PusherChatDispatch>();

  useEffect(() => {
    if (!lastMessage) return;
    if (lastMessage.senderId === authUser?.uid) {
      return;
    }

    if (isInView && lastMessage?.status !== "seen") {
      dispatch(setUnreads(0));

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
  }, [lastMessage, authUser?.uid, isInView]);
}
//---------------------------------------------------------message view area effects ends here--------------------------------------------------------------//

//-----------------------------------------------------------message panel effects ends here-------------------------------------------------------------//
