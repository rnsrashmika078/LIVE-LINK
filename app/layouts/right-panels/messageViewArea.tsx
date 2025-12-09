"use client";
import { Message, PusherChatState } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useInView } from "framer-motion";
import React from "react";
import Spinner from "@/app/component/ui/spinner";
import { useMessageSeenAPI } from "@/app/hooks/useEffectHooks";
import { OnMessageSeen } from "@/app/helper/jsxhelper";
import { MessageUI } from "@/app/component/ui/message";

interface ViewAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: Message[];
  state: boolean;
}
export const MessageViewArea = React.memo(
  ({ messages, state, ...props }: ViewAreaProps) => {
    //states
    const [isClickedMessage, setIsClickedMessage] = useState<boolean>(false);

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
      <div className="p-5 relative custom-scrollbar-y" {...props}>
        <Spinner condition={state} />
        {messages.map((msg, index) => {
          //only display relevant messages to the chats
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
                onClick={() => setIsClickedMessage((prev) => !prev)}
                className={`flex flex-col w-fit px-3 py-1  ${
                  msg.senderId === states.authUser?.uid
                    ? "justify-end bg-[var(--pattern_7)] rounded-tr-2xl"
                    : "justify-start bg-[var(--pattern_2)] rounded-tl-2xl"
                }`}
              >
                {/* message display ui goes here */}
                <MessageUI msg={msg.content} />
                <div className="flex items-end gap-2">
                  <p className="text-[10px] text-[var(--pattern_4)]">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                  {OnMessageSeen(
                    msg.senderId === states.authUser?.uid,
                    msg.status!
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
