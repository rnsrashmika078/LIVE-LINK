"use client";
import { Message, PusherChatState } from "@/app/types";
import { Suspense, useEffect, useRef } from "react";
import {
  IoCheckmark,
  IoCheckmarkDone,
  IoCheckmarkDoneSharp,
} from "react-icons/io5";
import { useSelector } from "react-redux";
import { useInView } from "framer-motion";
import React from "react";
interface ViewAreaProps {
  messages: Message[];
}
export const MessageViewArea = React.memo(({ messages }: ViewAreaProps) => {
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );

  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isInView = useInView(scrollRef);

  useEffect(() => {
    const asyncfunction = () => {
      if (
        isInView &&
        messages[messages.length - 1]?.receiverId === authUser?.uid &&
        messages[messages.length - 1]?.status
      ) {
        const seenUpdate = async () => {
          const res = await fetch("/api/message-seen", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chatId: activeChat?.chatId,
              receiverId: activeChat?.uid,
              senderId: authUser?.uid,
            }),
          });
          const result = await res.json();

          if (result) {
            // alert(result.message);
          }
        };
        seenUpdate();
      }
    };
    asyncfunction();
  }, [activeChat?.chatId, activeChat?.uid, authUser?.uid, isInView, messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-5  overflow-y-auto custom-scrollbar-y">
     
      {messages?.map((msg, index) => {
        if (msg.chatId !== activeChat?.chatId) {
          return;
        }
        return (
          <div
            key={index}
            className={`flex w-full mt-2 ${
              msg.senderId === authUser?.uid ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex flex-col w-fit px-3 py-1  ${
                msg.senderId === authUser?.uid
                  ? "justify-end bg-gradient-to-r rounded-tl-xl from-purple-800  to-purple-400"
                  : "justify-start bg-gradient-to-r rounded-br-xl from-green-800  to-green-700"
              }`}
            >
              <p className={`flex w-fit font-bold mt-1`}>{msg.content}</p>

              <div className="flex items-end gap-2">
                <p className="text-[10px] text-[var(--pattern_4)]">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </p>
                {msg.senderId === authUser?.uid && (
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
});
MessageViewArea.displayName = "MessageViewArea";
