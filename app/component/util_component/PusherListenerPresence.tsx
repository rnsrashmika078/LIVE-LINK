/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
import { setNotification } from "@/app/lib/redux/notificationSlicer";

export default function PusherListenerPresence() {
  const dispatch = useDispatch<PusherChatDispatch>();

  const { chats, groupChats, authUser } = useSelector(
    (store: PusherChatState) => ({
      authUser: store.chat.authUser,
      chats: store.chat.chats, // this is individual chats
      groupChats: store.chat.groupChats,
    }),
    shallowEqual
  );
  const pusher = usePusher();

  const handler = (data: any) => {
    if (data.useFor === "typing") {
      if (data.senderId === authUser?.uid) return;
      const typeData = {
        userId: data.userId ?? "",
        chatId: data.chatId ?? "",
        userName: data.userName ?? "",
        isTyping: data.isTyping ?? false,
      };
      dispatch(setTypingUsers(typeData as TypingUser));
    } else if (data.useFor === "deleting") {
      dispatch(setDeletedMessage(data as DeletedMessage));
    } else {
      //receiving real time message
      dispatch(setMessages(data as Message)); //store last message
      dispatch(setMessagesArray(data as Message)); //store and update whole session messages as array
    }
  };

  useEffect(() => {
    if (!pusher || !authUser?.uid) return;

    const chat_channels: Record<string, any> = {};

    [...groupChats, ...chats].forEach((chat) => {
      if (!chat.chatId) {
        return;
      }
      const channelName = `private-message-${chat.chatId}`;
      const channel = pusher.subscribe(channelName);

      channel.bind("client-message", (data: any) => {
        handler(data);
      });
      chat_channels[chat.chatId] = channel;
    });

    return () => {
      Object.values(chat_channels).forEach((channel) => {
        channel.unbind_all();
        pusher.unsubscribe(channel.name);
      });
    };
  }, [authUser?.uid, groupChats, chats, pusher]);

  /**
   *  remove the following from the dependency array:
   *  **`Dispatch`**
   *  */

  return null;
}
