"use client";
import { Message, PusherChatDispatch, PusherChatState } from "@/app/types";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  IoCheckmark,
  IoCheckmarkDone,
  IoCheckmarkDoneSharp,
} from "react-icons/io5";
import Image from "next/image";

import { useSelector } from "react-redux";
import { useInView } from "framer-motion";
import React from "react";
import { modifiedMessageOnMessageArea } from "@/app/util/helper";
import Spinner from "@/app/component/ui/spinner";
import Display from "@/app/component/ui/display";
interface ViewAreaProps {
  messages: Message[];
  state: boolean;
}
export const MessageViewArea = React.memo(
  ({ messages, state }: ViewAreaProps) => {
    const activeChat = useSelector(
      (store: PusherChatState) => store.chat.activeChat
    );
    const authUser = useSelector(
      (store: PusherChatState) => store.chat.authUser
    );
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(scrollRef);
    useEffect(() => {
      const lastMessage = messages.at(-1);
      if (!lastMessage) return;

      const asyncfunction = () => {
        if (
          isInView &&
          lastMessage?.receiverId === authUser?.uid &&
          lastMessage?.status !== "seen"
        ) {
          const seenUpdate = async () => {
            const res = await fetch("/api/messages/message-seen", {
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

            if (result && result.success) {
            }
          };
          seenUpdate();
        }
      };
      asyncfunction();
    }, [messages]);

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
            if (msg.chatId !== activeChat?.chatId) {
              return;
            }
            return (
              <div
                key={index}
                className={`flex w-full mt-2 ${
                  msg.senderId === authUser?.uid
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex flex-col w-fit px-3 py-1  ${
                    msg.senderId === authUser?.uid
                      ? "justify-end bg-gradient-to-r rounded-tl-xl from-purple-800  to-purple-400"
                      : "justify-start bg-gradient-to-r rounded-br-xl from-green-800  to-green-700"
                  }`}
                >
                  <Display msg={msg.content} />
                  {/* <Image
                    src={JSON.parse(msg.content)?.url ?? "/12.png"}
                    alt="upload Image"
                    width={150}
                    height={150}
                    className="object-contain"
                  ></Image> */}
                  {/* <p className={`flex w-fit font-bold mt-1`}>
                    {JSON.parse(msg.content)?.message}
                  </p> */}
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
  }
);
MessageViewArea.displayName = "MessageViewArea";
