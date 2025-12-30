/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { AgentType, ChatsType, Message, PusherChatState } from "@/app/types";
import { useEffect, useMemo, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import React from "react";
import { MessageUI } from "@/app/component/ui/message";
import { MdArrowDropDown } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { parse } from "jsonc-parser";

interface ViewAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: AgentType[];
}
function MessageViewArea({ messages, ...props }: ViewAreaProps) {
  //states

  const { activeChat, authUser } = useSelector(
    (store: PusherChatState) => ({
      activeChat: store.chat.activeChat as ChatsType,
      authUser: store.chat.authUser,
    }),
    shallowEqual
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="p-5 relative custom-scrollbar-y h-full w-full" {...props}>
      {messages.map((msg, index) => {
        let message;
        if (msg.type === "agent") {
          try {
            const data = parse(msg?.message);
            if (!data) return;
            const { answer, title } = data;

            if (answer) {
              message = answer;
            } else {
              message = msg.message;
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          message = msg.message;
        }
        console.log("message", msg.type);
        return (
          <div
            key={index}
            className={`flex  ${
              msg?.type === "user" ? "justify-end " : "justify-start"
            }`}
          >
            <div
              className={`flex mt-2 ${
                msg?.type === "user"
                  ? "justify-end bg-green-800 p-2 rounded-l-2xl shadow-2xl"
                  : "justify-start bg-blue-800 p-2 rounded-r-2xl shadow-2xl"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children, ...props }) => (
                    <h1
                      className="text-2xl font-bold text-green-500 mb-2"
                      {...props}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2
                      className="text-xl font-semibold text-green-400 mb-2"
                      {...props}
                    >
                      {children}
                    </h2>
                  ),
                  p: ({ children, ...props }) => (
                    <p className="text-white mb-2" {...props}>
                      {children}
                    </p>
                  ),
                  ul: ({ children, ...props }) => (
                    <ul className="list-disc ml-5 mb-2" {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol className="list-decimal ml-5 mb-2" {...props}>
                      {children}
                    </ol>
                  ),
                  li: ({ children, ...props }) => (
                    <li className="mb-1" {...props}>
                      {children}
                    </li>
                  ),
                }}
              >
                {message}
              </ReactMarkdown>
            </div>
          </div>
        );
      })}
      <div ref={scrollRef}></div>
    </div>
  );
}

export default React.memo(MessageViewArea);
