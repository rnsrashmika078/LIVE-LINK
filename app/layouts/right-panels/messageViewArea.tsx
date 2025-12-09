"use client";
import { Message, PusherChatState } from "@/app/types";
import { useEffect, useRef } from "react";
import {
  IoCheckmark,
  IoCheckmarkDone,
  IoCheckmarkDoneSharp,
} from "react-icons/io5";

import { shallowEqual, useSelector } from "react-redux";
import { useInView } from "framer-motion";
import React from "react";
import { modifiedMessageOnMessageArea } from "@/app/util/helper";
import Spinner from "@/app/component/ui/spinner";
import { Display } from "@/app/component/ui/display";
import { useMessageSeenAPI } from "@/app/hooks/useEffectHooks";

interface ViewAreaProps {
  messages: Message[];
  state: boolean;
}
export const MessageViewArea = React.memo(
  ({ messages, state }: ViewAreaProps) => {

    const states = useSelector(
      (store: PusherChatState) => ({
        activeChat: store.chat.activeChat,
        authUser: store.chat.authUser,
      }),
      shallowEqual
    );
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(scrollRef);
    const lastMessage = messages.at(-1);

    useMessageSeenAPI(
      isInView,
      lastMessage!,
      states.authUser!,
      states.activeChat!
    );

    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);



    return (
      <div className="p-5 relative custom-scrollbar-y">
        <Spinner condition={state} />
        {messages
          .sort((a, b) =>
            a.createdAt
              ? new Date(a.createdAt).getTime()
              : new Date().getTime() -
                (b.createdAt
                  ? new Date(b.createdAt).getTime()
                  : new Date().getTime())
          )
          .map((msg, index) => {
            if (msg.chatId !== states.activeChat?.chatId) {
              return;
            }
            return (
              <div
                key={index}
                className={`flex w-full mt-2 ${
                  msg.senderId === states.authUser?.uid
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex flex-col w-fit px-3 py-1  ${
                    msg.senderId === states.authUser?.uid
                      ? "justify-end bg-gradient-to-r rounded-tl-xl from-purple-800  to-purple-400"
                      : "justify-start bg-gradient-to-r rounded-br-xl from-green-800  to-green-700"
                  }`}
                >
                  <Display msg={msg.content} />
                  <p className={`flex w-fit font-bold mt-1`}>
                    {modifiedMessageOnMessageArea(msg.content, "message")}
                  </p>
                  <div className="flex items-end gap-2">
                    <p className="text-[10px] text-[var(--pattern_4)]">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                    {msg.senderId === states.authUser?.uid && (
                      <div>
                        {msg.status === "seen" && (
                          <IoCheckmarkDoneSharp color="blue" />
                        )}
                        {msg.status === "delivered" && <IoCheckmarkDone />}
                        {msg.status === "sent" && <IoCheckmark />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        <div ref={scrollRef}></div>
      </div>
    );
  }
);
MessageViewArea.displayName = "MessageViewArea";
