"use client";
import { Message, PusherChatState } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useInView } from "framer-motion";
import React from "react";
import Spinner from "@/app/component/ui/spinner";
import { useMessageSeenAPI } from "@/app/hooks/useEffectHooks";
import { MessageUI } from "@/app/component/ui/message";
import { DropDown, MenuItem } from "@/app/component/ui/dropdown";
import { MdArrowDropDown } from "react-icons/md";
import { useMessageDelete } from "@/app/lib/tanstack/messageQuery";

interface ViewAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: Message[];
  state: boolean;
}
export const MessageViewArea = React.memo(
  ({ messages, state, ...props }: ViewAreaProps) => {
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

    const [id, setId] = useState<string>("");

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
      switch (value) {
        case "Delete":
          deleteMessage({
            messageId,
            public_id,
            chatId,
          });
      }
    };
    return (
      <div className="p-5 relative custom-scrollbar-y h-full w-full" {...props}>
        <Spinner condition={state} />
        {/* drop down menu goes here */}

        {messages.map((msg, index) => {
          //only display relevant messages to the chats
          if (msg.chatId !== states.activeChat?.chatId) {
            return;
          }
          return (
            <div key={index} className=" ">
              <MessageUI msg={msg} authUser={states.authUser!} selectId={id}>
                <MdArrowDropDown
                  size={25}
                  onClick={() => {
                    setId(msg.customId ?? "");
                  }}
                  className="absolute top-0 right-0 flex justify-center "
                />
                {id === msg.customId && (
                  <DropDown
                    authUser={states.authUser!}
                    message={msg}
                    onSelect={(value) => {
                      const { public_id } = JSON.parse(msg.content ?? "");
                      handleOperation(
                        value,
                        msg.customId ?? "",
                        msg.chatId ?? "",
                        public_id ?? ""
                      );
                    }}
                  >
                    <MenuItem value="Reply" />
                    <MenuItem value="Copy" />
                    <MenuItem value="Forward" />
                    <MenuItem value="Delete" />
                    <MenuItem value="Report" />
                  </DropDown>
                )}
              </MessageUI>
            </div>
          );
        })}
        <div ref={scrollRef}></div>
      </div>
    );
  }
);
MessageViewArea.displayName = "MessageViewArea";
