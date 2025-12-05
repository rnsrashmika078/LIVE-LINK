"use client";
import { useEffect } from "react";
import Pusher from "pusher-js";
import { useDispatch, useSelector } from "react-redux";
import { PusherChatDispatch, PusherChatState } from "@/app/types";

import { setMessages, setMessagesArray } from "@/app/lib/redux/chatslicer";
import { Message } from "@/app/types/index";
type MessageType = {
  from: string;
  senderId: string;
  message: string;
  targetUserId: string;
};

export default function PusherListenerPresence() {
  const dispatch = useDispatch<PusherChatDispatch>();
  const chats = useSelector((store: PusherChatState) => store.chat.chats);
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
 
  useEffect(() => {
    if (!authUser?.uid || !chats.length) {
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
      auth: {
        headers: {
          "X-User-Id": authUser?.uid,
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chat_channels: Record<string, any> = {}; //[chaId:string] : boolean
    chats.forEach((chat) => {
      const channel = pusher.subscribe(`private-message-${chat.chatId}`);
      channel.bind("pusher:subscription_error", (error: MessageType) => {
        console.log(error instanceof Error ? error.message : undefined);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      channel.bind("message", (data: Message) => {
        dispatch(setMessages(data));
        dispatch(setMessagesArray(data));
      });
      chat_channels[chat.chatId] = channel;
    });

    return () => {
      Object.values(chat_channels).forEach((channel) => channel.unbind_all());
      pusher.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.uid, chats.length, dispatch]);

  return null;
}
