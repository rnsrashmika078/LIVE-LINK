/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import {
  OpenChatType,
  PusherChatState,
  ScheduleMessageType,
} from "@/app/types";
import { useCallback, useEffect, useMemo, useRef } from "react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UIDataTypes, UIMessage, UIMessagePart, UITools } from "ai";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { openChatTask, ScheduleMessageTask } from "@/app/helper/agentTasks";
import { setAuthUser } from "@/app/lib/redux/chatslicer";
import { useSelector } from "react-redux";
import { useSaveMessage } from "@/app/lib/tanstack/messageQuery";
interface ViewAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
}
const MessageViewArea = React.memo(({ messages }: ViewAreaProps) => {
  //states
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const { chatRefs } = useLiveLink();
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const { mutate } = useSaveMessage((result) => {});

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;

    last.parts?.forEach((part) => {
      if (part.type === "tool-openChatTool" && part.output) {
        openChatTask(part.output as OpenChatType, chatRefs);
      }

      if (part.type === "tool-scheduleMessageTool" && part.output) {
        ScheduleMessageTask(
          part.output as ScheduleMessageType,
          authUser,
          true,
          "Offline",
          (p) => mutate({ message: p })
        );
      }
    });
  }, [authUser, chatRefs, messages, mutate]);

  return (
    <div className="flex flex-col w-full p-5 mx-auto custom-scrollbar-y">
      <div>
        {messages?.map((message: UIMessage) => (
          <div
            key={message.id}
            className={`flex flex-col w-full p-2  custom-scrollbar  ${
              message.role === "user" ? "items-end " : "items-start "
            }`}
          >
            {/* <p className="text-[10px] flex w-fit">
            {message.role === "user" ? "You" : "AI"}
          </p> */}
            <div
              className={` custom-scrollbar  ${
                message.role === "user"
                  ? " bg-[var(--pattern_7)] p-2 rounded-xl "
                  : "bg-[var(--pattern_3)] p-2 rounded-xl "
              }`}
            >
              {message?.parts?.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="custom-scrollbar"
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children, ...props }) => (
                              <h1
                                className="text-white text-2xl font-bold"
                                {...props}
                              >
                                {children}
                              </h1>
                            ),
                            h2: ({ children, ...props }) => (
                              <h2
                                className="text-white text-xl font-semibold"
                                {...props}
                              >
                                {children}
                              </h2>
                            ),
                            p: ({ children, ...props }) => (
                              <p className="text-white" {...props}>
                                {children}
                              </p>
                            ),
                            ul: ({ children, ...props }) => (
                              <ul
                                className="text-white list-disc ml-5"
                                {...props}
                              >
                                {children}
                              </ul>
                            ),
                            ol: ({ children, ...props }) => (
                              <ol
                                className="text-white list-decimal"
                                {...props}
                              >
                                {children}
                              </ol>
                            ),
                            li: ({ children, ...props }) => (
                              <li className="text-white" {...props}>
                                {children}
                              </li>
                            ),
                            code({ className, children }) {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );

                              // if (match) {
                              //   return (
                              //     <SyntaxHighlighter
                              //       style={vscDarkPlus}
                              //       language={match[1]}
                              //       PreTag="div"
                              //     >
                              //       {String(children).replace(/\n$/, "")}
                              //     </SyntaxHighlighter>
                              //   );
                              // }
                              return (
                                <code className="bg-zinc-600 px-1 rounded">
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    );
                  case "tool-openChatTool": {
                    // openChatTask(part.output as OpenChatType, chatRefs);
                    //@ts-expect-error: missing attribute
                    const reply = part?.output?.replyMessage;
                    return <p key={1}>{reply}</p>;
                  }

                  case "tool-scheduleMessageTool": {
                    //@ts-expect-error: missing attribute
                    const reply = part?.output?.replyMessage;
                    return <p key={1}>{reply}</p>;
                  }
                }
              })}
            </div>
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>
    </div>
  );
});
MessageViewArea.displayName = "MessageViewArea";
export default MessageViewArea;
