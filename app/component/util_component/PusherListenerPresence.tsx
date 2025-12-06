"use client";
import { useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { useDispatch, useSelector } from "react-redux";
import { PusherChatDispatch, PusherChatState } from "@/app/types";

import { setMessages, setMessagesArray } from "@/app/lib/redux/chatslicer";
import { Message } from "@/app/types/index";
import { setNotification } from "@/app/lib/redux/notificationSlicer";

export default function PusherListenerPresence() {
  const dispatch = useDispatch<PusherChatDispatch>();
  const chats = useSelector((store: PusherChatState) => store.chat.chats);
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    if (!authUser?.uid || !chats.length) {
      return;
    }
    if (!pusherRef.current) {
      pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        authEndpoint: "/api/pusher/auth",
        auth: {
          headers: {
            "X-User-Id": authUser.uid,
          },
        },
      });
    }
    const pusher = pusherRef.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chat_channels: Record<string, any> = {};

    chats.forEach((chat) => {
      if (!chat.chatId) {
        return;
      }
      const channelName = `private-message-${chat.chatId}`;
      const channel = pusher.subscribe(channelName);
      channel.bind("message", (data: Message) => {
        dispatch(setMessages(data));
        dispatch(setMessagesArray(data));
      });
      chat_channels[chat.chatId] = channel;
    });

    return () => {
      Object.values(chat_channels).forEach((channel) => {
        channel.unbind_all();
        pusher.unsubscribe(channel.name);
      });
    };
  }, [authUser?.uid, chats, dispatch]);

  return null;
}
