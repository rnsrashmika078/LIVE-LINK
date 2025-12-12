"use client";
import { Message, PusherChatState } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useInView } from "framer-motion";
import React from "react";
import Spinner from "@/app/component/ui/spinner";
import { useMessageSeenAPI } from "@/app/hooks/useEffectHooks";
import { MessageUI } from "@/app/component/ui/message";
import { ActionMenu } from "@/app/component/ui/action_menu";
import { useMessageDelete } from "@/app/lib/tanstack/messageQuery";
import { MdArrowDropDown } from "react-icons/md";
import Menu from "@/app/component/ui/action_menu";
import { useLiveLink } from "@/app/context/LiveLinkContext";

interface ViewAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: Message[];
  state: boolean;
}
function MessageViewArea({ messages, state, ...props }: ViewAreaProps) {
  //states

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
    if (messages) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const { mutate: deleteMessage } = useMessageDelete((result) => {
    if (result) {
    }
  });

  const handleOperation = (
    value: string,
    messageId: string,
    chatId: string,
    public_id: string
  ) => {
    alert(value);
    switch (value) {
      case "Delete":
        deleteMessage({
          messageId,
          public_id,
          chatId,
        });
    }
  };

  const { setId } = useLiveLink();
  return (
    <div className="p-5 relative custom-scrollbar-y h-full w-full" {...props}>
      <Spinner condition={state} />
      {/* {click} */}
      {/* drop down menu goes here */}

      {messages
        .filter((m) => m.chatId === states.activeChat?.chatId)
        .map((msg, index) => (
          //only display relevant messages to the chats
          <div key={index} className=" bg-blue-500">
            <MessageUI msg={msg} authUser={states.authUser!}>
              <MdArrowDropDown
                size={25}
                onClick={() => {
                  setId(msg.customId ?? "");
                }}
                className="absolute top-0 right-0  flex justify-center hover:opacity-100 opacity-0"
              />

              {/* {id === msg.customId && (
                <div className="absolute p-2 bg-amber-400 pointer-events-auto">
                  {["Reply", "Copy", "Forward", "Delete", "Report"].map(
                    (item, i) => (
                      <div key={i}>{item}</div>
                    )
                  )}
                </div>
              )} */}
            </MessageUI>
          </div>
        ))}
      <div ref={scrollRef}></div>
    </div>
  );
}

export default React.memo(MessageViewArea);
