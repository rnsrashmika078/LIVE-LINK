/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Avatar from "@/app/component/ui/avatar";
import { useDebounce } from "@/app/hooks/useHooks";
import { ChatsType, PusherChatState } from "@/app/types";
import React, { Suspense, useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { TextArea } from "@/app/component/ui/textarea";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import SearchArea from "../../ui/searcharea";
import AppIcons from "../../ui/icons";
import { agent, MessagePanelIcons } from "@/app/util/data";
import VoiceRecorder from "../../ui/communications/Voice";
import { useVoiceMessage } from "@/app/context/VoiceMessageContext";
import Skeleton from "../../ui/skeleton";
import AgentMessage from "../../agent_component/AgentMessage";
import { useAgent } from "@/app/lib/tanstack/agentQuery";
import { useAgentContext } from "@/app/context/AgentContext";
import { v4 as uuid } from "uuid";
const AgentMessagePanel = () => {
  const { messages, setMessages, setAgentIsOpen } = useAgentContext();
  const [input, setInput] = useState<string>("");
  const [activeFeature, setActiveFeature] = useState<string>(""); // fo

  const { setClickedIcon, clickedIcon, setActionMenuSelection, setAgentTask } =
    useLiveLink();
  const { blobRef } = useVoiceMessage();

  const { activeChat } = useSelector(
    (store: PusherChatState) => ({
      activeChat: store.chat.activeChat,
    }),
    shallowEqual
  );

  const authUserName = useSelector(
    (store: PusherChatState) => store.chat.authUser?.name
  );

  const debounce = useDebounce(input, 200);
  const { mutate } = useAgent((message) => {
    if (message) {
      setAgentTask(message);
      setMessages((prev) =>
        prev.map((i) => {
          const exist = i.id === "dummy-01";
          if (!exist) return i;
          return { ...i, id: uuid(), message, type: "assistant" };
        })
      );
    }
  });
  const sendMessage = () => {
    const message = `{"title":"loading", "answer":"Working on it.."`;

    setMessages((prev) => [
      ...prev,
      { id: uuid(), type: "user", message: debounce },
      { id: "dummy-01", type: "assistant", message },
    ]);
    const latestMessage = debounce;
    const history = messages?.map((m) => m.message).join("\n") ?? "";

    const prompt = `
    You are an AI chatbot.
    
    STRICT OUTPUT RULES:
    - Respond ONLY to the user's query.
    - Be concise and clear.
    - NO reasoning, NO explanations, NO extra text.
    - NEVER return an empty response.
    - Return exactly ONE line of VALID JSON.
    - Do NOT wrap the JSON in code blocks.
    
    BASE JSON FORMAT (ALWAYS):
    {
      "title": "<short descriptive title>",
      "answer": "<full reply in Markdown>"
    }
    
    CONDITIONAL FUNCTION RULE:
    - Add the "function" key ONLY IF the user explicitly asks to perform an action
      such as: "open chat", "open this chat", "go to chat", "switch chat".
    - If the user does NOT request an action, DO NOT include the "function" key at all.
    
    FUNCTION FORMAT (WHEN INCLUDED):
    "function": {
      "title": "open-chat",
      "chatId": "<ID selected from chatList that best matches the user's request>"
    }
    
    FUNCTION CONSTRAINTS:
    - "function" MUST be a JSON object, never a string.
    - "title" inside "function" MUST always be "open-chat".
    - "chatId" MUST be selected ONLY from the chatList below.
    - NEVER invent, modify, or guess chatId values.
    - Choose the most relevant chatId based on user intent.
    
    CHAT LIST:
    [
      "IZzoL4eNf5fprlpLp5Up59XwlPC2-Vc5pftz3lmXNSZvHoQy5HmAowb53",
      "IZzoL4eNf5fprlpLp5Up59XwlPC2-Mjq7j4WY1hWsQ7lJ8bqfI3h8zI93"
    ]
    
    MARKDOWN RULES:
    - The "answer" field MUST preserve valid Markdown.
    - Ensure Markdown remains valid JSON (escape quotes properly).
    
    USER QUERY:
    "${latestMessage}" 
    CHAT HISTORY : ${history}
    `;

    mutate({ prompt: prompt });
    setInput("");
  };

  const handleButtonClick = (item: string) => {
    switch (item) {
      case "send":
      case "enter":
        sendMessage();
        break;
    }
  };

  useEffect(() => {
    setAgentIsOpen(true);

    return () => {
      setAgentIsOpen(false);
    };
  }, []);

  useEffect(() => {
    if (messages.length !== 0) return;
    const message = `{"title":"Welcome", "answer":"Hey ${authUserName}! Welcome to LiveLink. What do you want to do with me🤗?"`;
    setMessages((prev) => [
      ...prev,
      {
        id: uuid(),
        message: message,
        type: "assistant",
      },
    ]);
  }, [messages, authUserName]);

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      {activeChat && (
        <>
          <div className=" flex p-5  justify-between w-full bg-[var(--pattern_3)] items-center  sticky top-0">
            <div
              className=" flex items-center gap-3 "
              onClick={() =>
                setActionMenuSelection({
                  selection: "message-Info",
                  message: null,
                })
              }
            >
              <Avatar image={agent?.dp || "/no_avatar2.png"} />
              <div className="w-full">
                <h1 className="">{agent?.name}</h1>
                <p className="text-xs text-[var(--pattern_4)]">Online</p>
              </div>
            </div>
            <AppIcons iconArray={MessagePanelIcons} callback={setClickedIcon} />
          </div>

          <Suspense fallback={<Skeleton version="chats" />}>
            <AgentMessage messages={messages} />
          </Suspense>

          {/* Communication Component */}
          {clickedIcon === "search" && (
            <div className="">
              <SearchArea />
            </div>
          )}

          <div className="flex flex-col gap-5 mt-auto w-full p-2 place-items-start ">
            <div className="flex w-full gap-2 place-items-center">
              {!activeFeature.toLowerCase().includes("voice") ? (
                <div className="flex w-full gap-2">
                  <TextArea
                    value={input}
                    placeholder={`Enter your message`}
                    onChange={(e) => {
                      setInput(e.currentTarget.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleButtonClick("enter");
                      }
                    }}
                    onClickButton={(input) => {
                      handleButtonClick(input);
                    }}
                  />
                </div>
              ) : (
                <VoiceRecorder
                  setActiveFeature={setActiveFeature}
                  onClick={(input) => {
                    if (blobRef.current) handleButtonClick(input.toLowerCase());
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default AgentMessagePanel;
