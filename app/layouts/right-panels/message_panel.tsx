"use client";
import Avatar from "@/app/component/ui/avatar";
import { useOnlinePresence } from "@/app/hooks/useHooks";
import {
  useGetMessages,
  useSaveMessage,
} from "@/app/lib/tanstack/tanstackQuery";
import { Message, PusherChatState } from "@/app/types";
import { useQueryClient } from "@tanstack/react-query";
import React, { Suspense, useEffect, useState } from "react";
import { BiPhoneCall, BiSearch, BiVideo } from "react-icons/bi";

import { useSelector } from "react-redux";
import { MessageViewArea } from "./messageViewArea";
import Spinner from "@/app/component/spinner";

export const MessageArea = () => {
  //use states
  const [messages, setMessages] = useState<Message[]>([]);
  const QueryClient = useQueryClient();

  //redux states
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );
  const messageSeen = useSelector(
    (store: PusherChatState) => store.chat.messageSeen
  );
  const liveMessages = useSelector(
    (store: PusherChatState) => store.chat.messages
  );
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);

  //generate chatId
  const chatId = [authUser?.uid, activeChat?.uid].sort().join("-");

  //get Messages ( tanstack )
  const { data, isPending, refetch } = useGetMessages(chatId);

  const isOnline = useOnlinePresence(activeChat?.uid ?? "");

  //save message  ( tanstack )
  const { mutate } = useSaveMessage((result) => {
    if (messages.length === 0) {
      if (result.success) {
        refetch();
        QueryClient.invalidateQueries({
          queryKey: ["get-chats", authUser?.uid ?? ""],
        });
      }
    }
  });
  const request = async (message: string) => {
    const date = new Date();
    mutate({
      content: message,
      senderId: authUser?.uid ?? "",
      receiverId: activeChat?.uid ?? "",
      chatId: chatId,
      name: authUser?.name ?? "",
      dp: authUser?.dp ?? "",
      createdAt: date.toISOString(),
      status: isOnline === "Online" ? "delivered" : "sent",
    });
  };

  //use Effect: merge lives messages ( pusher ) with current Message
  useEffect(() => {
    const addLiveMessage = () => {
      if (!liveMessages) return;
      setMessages((prev) => [...prev, liveMessages]);
    };
    addLiveMessage();
  }, [authUser?.uid, liveMessages]);

  //use Effect: add messages that fetch from backend to the messages state ( initially )
  useEffect(() => {
    const AsyncMessages = () => {
      if (data && data?.history) {
        setMessages(data?.history);
      }
    };
    AsyncMessages();
  }, [data]);

  const presence = useOnlinePresence(activeChat?.uid ?? "");
  useEffect(() => {
    const seenStat = () => {
      setMessages((prev) =>
        prev.map((c) =>
          c.senderId === messageSeen?.senderId ? c : { ...c, status: "seen" }
        )
      );
    };
    seenStat();
  }, [messageSeen]);
  return (
    <div className="flex flex-col w-full overflow-x-auto h-full ">
      {activeChat && (
        <>
          <div className="flex p-5 justify-between w-full bg-[var(--pattern_3)] items-center  sticky top-0">
            <div className="flex items-center gap-3">
              <Avatar image={activeChat?.dp || "/no_avatar2.png"} />
              <div className="w-full">
                <h1 className="">{activeChat?.name}</h1>
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
