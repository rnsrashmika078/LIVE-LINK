/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import {
  ChatsType,
  Message,
  PusherChatState,
} from "@/app/types";
import { useEffect, useMemo, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useInView } from "framer-motion";
import React from "react";
import { MessageUI } from "@/app/component/ui/message";
import { MdArrowDropDown } from "react-icons/md";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { useMessageSeenAPI } from "@/app/hooks/CustomHooks/messageEffectHooks";

interface ViewAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: Message[];
}
function MessageViewArea({ messages, ...props }: ViewAreaProps) {
  //states
  const { setId } = useLiveLink();

  const { activeChat, authUser } = useSelector(
    (store: PusherChatState) => ({
      activeChat: store.chat.activeChat as ChatsType,
      authUser: store.chat.authUser,
    }),
    shallowEqual
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(scrollRef);
  const lastMessage = useMemo(() => messages.at(-1), [messages]);

  useMessageSeenAPI(
    isInView,
    lastMessage!,
    authUser!,
    activeChat,
    activeChat.type
  );

  useEffect(() => {
    if (messages) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="p-5 relative custom-scrollbar-y h-full w-full" {...props}>
      {messages
        .filter((m) => m.chatId === activeChat?.chatId)
        .map((msg, index) => (
          <div key={index} className=" ">
            <MessageUI msg={msg} authUser={authUser!} type={activeChat?.type}>
              <MdArrowDropDown
                size={25}
                onClick={() => {
                  setId(msg.customId ?? "");
                }}
                className="absolute top-0 right-0  flex justify-center hover:opacity-100 opacity-0"
              />
            </MessageUI>
          </div>
        ))}
      <div ref={scrollRef}></div>
    </div>
  );
}

export default React.memo(MessageViewArea);
