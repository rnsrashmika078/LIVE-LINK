/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DeletedMessage,
  PusherChatDispatch,
  PusherChatState,
  TypingUser,
} from "@/app/types";

import {
  setDeletedMessage,
  setMessages,
  setMessagesArray,
  setTypingUsers,
} from "@/app/lib/redux/chatslicer";
import { Message } from "@/app/types/index";
import { usePusher } from "./PusherProvider";

export default function PusherListenerPresence() {
  const dispatch = useDispatch<PusherChatDispatch>();
  const chats = useSelector((store: PusherChatState) => store.chat.chats);
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const pusher = usePusher();


  useEffect(() => {
    if (!pusher) {
      console.log("no pusher found!");
      return;
    }
    if (!authUser?.uid) {

      return;
    }


    const chat_channels: Record<string, any> = {};


    chats.forEach((chat) => {
      if (!chat.chatId) {


        return;
      }


      const channelName = `private-message-${chat.chatId}`;

      const channel = pusher.subscribe(channelName);
      channel.bind("client-message", (data: any) => {
        if (data.type === "typing") {
          if (data.senderId === authUser?.uid) return;
          const typeData = {
            userId: data.userId ?? "",
            chatId: data.chatId ?? "",
            isTyping: data.isTyping ?? false,
          };
          dispatch(setTypingUsers(typeData as TypingUser));
        } else if (data.type === "deleting") {
          dispatch(setDeletedMessage(data as DeletedMessage));
        } else {
          dispatch(setMessages(data as Message));
          dispatch(setMessagesArray(data as Message));
        }
      });
      chat_channels[chat.chatId] = channel;
    });

    return () => {
      Object.values(chat_channels).forEach((channel) => {
        channel.unbind_all();
        pusher.unsubscribe(channel.name);
      });
    };
  }, [authUser?.uid, chats, dispatch, pusher]);

  return null;
}
