/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { AgentType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { safeParse, streamingEffect } from "@/app/helper/helper";
import { parse } from "jsonc-parser";
interface ViewAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: AgentType[];
}
function MessageViewArea({ messages, ...props }: ViewAreaProps) {
  //states
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const [streamText, setStreamText] = useState("");

  const lastIndex = messages.length - 1;

  useEffect(() => {
    const lastMsg = messages[lastIndex];
    if (lastMsg?.type === "assistant") {
      const parsed = safeParse(lastMsg);
      streamingEffect(parsed, setStreamText);
    }
  }, [messages]);
  return (
    <div className="p-5 relative custom-scrollbar-y h-full w-full" {...props}>
      {messages.map((msg: AgentType, index: number) => {
        const message = safeParse(msg);
        return (
          <div
            key={index}
            className={`flex   ${
              msg?.type === "user" ? "justify-end " : "justify-start"
            }`}
          >
            <div
              className={`flex flex-col mt-4 ${
                msg?.type === "user"
                  ? "justify-end pattern_3 p-2 rounded-l-2xl shadow-2xl"
                  : "justify-start pattern_2 p-2 rounded-r-2xl shadow-2xl"
              }`}
            >
              {msg.type === "user" && <p>{message}</p>}
              {msg.type === "assistant" &&
                index === lastIndex &&
                streamText.startsWith("Working on it..") && (
                  <div className="mb-2 text-sm text-gray-400">
                    Working indicator...
                  </div>
                )}

              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children, ...props }) => (
                    <h1
                      className="text-4xl font-bold text-white mb-2"
                      {...props}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2
                      className="text-3xl font-bold text-white  mb-2"
                      {...props}
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3
                      className="text-xl font-bold text-white underline  mb-2"
                      {...props}
                    >
                      {children}
                    </h3>
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
                    <ol className="list-decimal ml-5 mb-2 " {...props}>
                      {children}
                    </ol>
                  ),
                  li: ({ children, ...props }) => (
                    <li className="mb-1 " {...props}>
                      {children}
                    </li>
                  ),
                  div: ({ children, ...props }) => (
                    <div className="mb-1 " {...props}>
                      {children}
                    </div>
                  ),
                }}
              >
                {msg.type === "assistant"
                  ? index === lastIndex
                    ? streamText.startsWith("Working on it..")
                      ? ""
                      : streamText
                    : message
                  : ""}
              </ReactMarkdown>
            </div>
          </div>
        );
      })}
      <div ref={scrollRef} className=""></div>
    </div>
  );
}

export default React.memo(MessageViewArea);
