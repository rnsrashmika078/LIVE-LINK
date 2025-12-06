/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Avatar from "@/app/component/ui/avatar";
import { useOnlinePresence } from "@/app/hooks/useHooks";
import {
  useGetMessages,
  useSaveMessage,
} from "@/app/lib/tanstack/tanstackQuery";
import { Message, PusherChatDispatch, PusherChatState } from "@/app/types";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { BiPhoneCall, BiSearch, BiVideo } from "react-icons/bi";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { MessageViewArea } from "./messageViewArea";
import Spinner from "@/app/component/spinner";
import { setActiveChat, setUnreads } from "@/app/lib/redux/chatslicer";

export const MessageArea = () => {
  //use states
  const [messages, setMessages] = useState<Message[]>([]);
  // const [count, setCount] = useState<number>(0);

  //query client ( tanstack )
  const QueryClient = useQueryClient();

  //redux states

  const states = useSelector(
    (store: PusherChatState) => ({
      activeChat: store.chat.activeChat,
      unreads: store.chat.unreads,
      messageSeen: store.chat.messageSeen,
      // liveMessages: store.chat.messages,
      authUser: store.chat.authUser,
    }),
    shallowEqual
  );
  // const activeChat = useSelector(
  //   (store: PusherChatState) => store.chat.activeChat
  // );
  // const unreads = useSelector((store: PusherChatState) => store.chat.unreads);
  // const messageSeen = useSelector(
  //   (store: PusherChatState) => store.chat.messageSeen
  // );
  const liveMessages = useSelector(
    (store: PusherChatState) => store.chat.messages
  );
  // const authUser = useSelector((store: PusherChatState) => store.chat.authUser);

  //generate chatId
  const chatId = useMemo(
    () => [states.authUser?.uid, states.activeChat?.uid].sort().join("-"),
    [states.authUser?.uid, states.activeChat?.uid]
  );
  //get Messages ( tanstack )
  const { data, isPending, refetch } = useGetMessages(chatId);

  const isOnline = useOnlinePresence(states.activeChat?.uid ?? "");

  const dispatch = useDispatch<PusherChatDispatch>();

  //save message  ( tanstack )
  const { mutate } = useSaveMessage((result) => {
    if (messages.length === 0) {
      if (result.success) {
        refetch();
        QueryClient.invalidateQueries({
          queryKey: ["get-chats", states.authUser?.uid ?? ""],
        });
      }
    }
  });
  const request = async (message: string) => {
    const date = new Date();
    mutate({
      content: message,
      senderId: states.authUser?.uid ?? "",
      receiverId: states.activeChat?.uid ?? "",
      chatId: chatId,
      name: states.authUser?.name ?? "",
      dp: states.authUser?.dp ?? "",
      createdAt: date.toISOString(),
      status: isOnline === "Online" ? "delivered" : "sent",
      unreads: [
        { userId: states.activeChat?.uid ?? "", count: states.unreads },
      ], // find a way to increase this count in the future : currently it only save count as 1 in db
    });
    dispatch(setUnreads(states.unreads + 1));
  };

  //use Effect: merge lives messages ( pusher ) with current Message
  useEffect(() => {
    if (!liveMessages) return;
    setMessages((prev) => [...prev, liveMessages]);
  }, [liveMessages]);
  // }, [authUser?.uid, liveMessages]);

  //use Effect: add messages that fetch from backend to the messages state ( initially )
  useEffect(() => {
    if (!data?.history) return;
    setMessages(data?.history);
  }, [data]);

  const presence = useOnlinePresence(states.activeChat?.uid ?? "");

  //UseEffect: update message seen
  useEffect(() => {
    if (!states.messageSeen?.receiverId || !states.activeChat?.chatId) return;

    setMessages((prev) =>
      prev.map((c) =>
        c.senderId === states.messageSeen?.receiverId &&
        c.chatId === states.activeChat?.chatId
          ? { ...c, status: "seen" }
          : c
      )
    );
  }, [states.activeChat?.chatId, states.messageSeen?.receiverId]);

  return (
    <div className="flex flex-col w-full overflow-x-auto h-full ">
      {states.activeChat && (
        <>
          <div className="flex p-5 justify-between w-full bg-[var(--pattern_3)] items-center  sticky top-0">
            <div className="flex items-center gap-3">
              <Avatar image={states.activeChat?.dp || "/no_avatar2.png"} />
              <div className="w-full">
                <h1 className="">{states.activeChat?.name}</h1>
                <p className="text-xs text-[var(--pattern_4)]">{presence}</p>
              </div>
            </div>

            <div className="flex gap-5">
              <BiPhoneCall size={20} />
              <BiVideo size={20} />
              <BiSearch size={20} />
            </div>
          </div>

          <Spinner condition={isPending} />
          <MessageViewArea messages={messages} />
          <div className="flex gap-5 mt-auto w-full p-2 place-items-center ">
            <textarea
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (messages.length === 0) {
                  }
                  request(e.currentTarget.value);
                  e.preventDefault();
                  e.currentTarget.value = "";
                }
              }}
              placeholder="Enter your message"
              className="w-full border p-2 rounded-xl custom-scrollbar-y"
            ></textarea>
          </div>
        </>
      )}
    </div>
  );
};
