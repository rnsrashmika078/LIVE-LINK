/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Avatar from "@/app/component/ui/avatar";
import { useDebounce, useOnlinePresence } from "@/app/hooks/useHooks";
import {
  useGetLastSeen,
  useGetMessages,
  useSaveMessage,
  useUpdateLastSeen,
} from "@/app/lib/tanstack/tanstackQuery";
import { Message, PusherChatDispatch, PusherChatState } from "@/app/types";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { BiPhoneCall, BiSearch, BiVideo } from "react-icons/bi";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { MessageViewArea } from "./messageViewArea";
import Spinner from "@/app/component/spinner";
import { setUnreads } from "@/app/lib/redux/chatslicer";
import { usePusher } from "@/app/component/util_component/PusherProvider";
import { TiMessageTyping } from "react-icons/ti";

export const MessageArea = () => {
  //use states
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [lastSeen, setLastSeen] = useState<string | null>(null);

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
      typingUsers: store.chat.typingUsers,
    }),
    shallowEqual
  );

  const liveMessages = useSelector(
    (store: PusherChatState) => store.chat.messages
  );

  //use hooks
  const debounce = useDebounce(input, 500);
  const pusher = usePusher();
  const presence = useOnlinePresence(states.activeChat?.uid ?? "");

  //generate chatId
  const chatId = useMemo(
    () => [states.authUser?.uid, states.activeChat?.uid].sort().join("-"),
    [states.authUser?.uid, states.activeChat?.uid]
  );

  //get Messages ( tanstack )
  const { data, isPending, refetch } = useGetMessages(chatId);

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
      status: presence === "Online" ? "delivered" : "sent",
      unreads: [
        { userId: states.activeChat?.uid ?? "", count: states.unreads },
      ], // find a way to increase this count in the future : currently it only save count as 1 in db
    });
    dispatch(setUnreads(states.unreads + 1));
  };

  useEffect(() => {
    setMessages([]);
  }, [states.activeChat?.chatId]);
  //use Effect: merge lives messages ( pusher ) with current Message
  useEffect(() => {
    if (!liveMessages) return;
    setMessages((prev) => [...prev, liveMessages]);
  }, [liveMessages]);

  //use Effect: add messages that fetch from backend to the messages state ( initially )
  useEffect(() => {
    if (!data?.history) return;
    setMessages(data?.history);
  }, [data]);

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

  //pusher typing state trigger
  useEffect(() => {
    if (!pusher || !states.activeChat?.chatId || !states.authUser?.uid) return;

    const channelName = `private-message-${states.activeChat?.chatId}`;

    const channel = pusher.channel(channelName);
    channel?.trigger("client-message", {
      type: "typing",
      userId: states.authUser?.uid,
      isTyping: !!debounce?.length,
    });
  }, [debounce, pusher, states.activeChat?.chatId, states.authUser?.uid]);

  const isUserTyping = useMemo(
    () =>
      states.typingUsers.some(
        (u) => u.userId === states.activeChat?.uid && u.isTyping
      ),
    [states.activeChat?.uid, states.typingUsers]
  );

  const { data: lastSeenUpdate } = useGetLastSeen(states.activeChat?.uid ?? "");

  const { mutate: lastSeenMutate } = useUpdateLastSeen((result) => {});

  useEffect(() => {
    const seenTime = new Date().toString();
    lastSeenMutate({
      uid: states.activeChat?.uid ?? "",
      lastSeen: seenTime?.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presence]);


  // const lastSeenTime: any = useMemo(() => {}, [presence]);
  return (
    <div className="flex flex-col w-full overflow-x-auto h-full ">
      {states.activeChat && (
        <>
          <div className="flex p-5 justify-between w-full bg-[var(--pattern_3)] items-center  sticky top-0">
            <div className="flex items-center gap-3">
              <Avatar image={states.activeChat?.dp || "/no_avatar2.png"} />
              <div className="w-full">
                <h1 className="">{states.activeChat?.name}</h1>
                <p className="text-xs text-[var(--pattern_4)]">
                  {presence !== "Online"
                    ? lastSeenUpdate?.lastSeen
                      ? "Last Seen: " +
                        new Date(lastSeenUpdate?.lastSeen).toLocaleTimeString()
                      : null
                    : presence}
                </p>
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

          <div className="flex flex-col gap-5 mt-auto w-full p-2 place-items-start ">
            {isUserTyping ? (
              <div className="animate-pulse px-5 ">
                <TiMessageTyping size={40} color="green" />
              </div>
            ) : null}
            <textarea
              onInput={(e) => {
                setInput(e.currentTarget.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (messages.length === 0) {
                  }
                  request(e.currentTarget.value);
                  e.preventDefault();
                  setInput("");
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
