/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Avatar from "@/app/component/ui/avatar";
import { useDebounce } from "@/app/hooks/useHooks";

import { AgentType, ChatsType, Message, PusherChatState } from "@/app/types";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { TextArea } from "@/app/component/ui/textarea";
import { FileShare } from "@/app/component/ui/preview";
import { useDragDropHook } from "@/app/hooks/useDragDropHook";
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
const MiniAgentPanel = () => {
  const { messages, setMessages } = useAgentContext();
  const [input, setInput] = useState<string>("");
  const [activeFeature, setActiveFeature] = useState<string>(""); // fo
  const [model, setModel] = useState<string>("llama3.2:latest");

  const { setClickedIcon, clickedIcon, setActionMenuSelection, setAgentTask } =
    useLiveLink();
  const { blobRef } = useVoiceMessage();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat as ChatsType
  );
  const debounce = useDebounce(input, 200);
  console.log("message", messages.at(-1));
  const { mutate } = useAgent((message) => {
    if (message) {
      setAgentTask(message);
      setMessages((prev) => [...prev, { type: "agent", message: message }]);
    }
  });

  const {
    isDragging,
    file,
    setFile,
    preview,
    setPreview,
    handleDragOver,
    onDragLeave,
    handleDrop,
  } = useDragDropHook();

  // useEffect(() => {
  //   setMessages([]);
  //   setInput("");
  //   // debounce = "";
  //   if (textAreaRef.current) {
  //     textAreaRef.current.value = "";
  //   }
  // }, [activeChat?.chatId]);

  const sendMessage = () => {
    setMessages((prev) => [...prev, { type: "user", message: debounce }]);
    const latestMessage = debounce.replace(/[\r\n]+/g, " ");
    const history = messages?.map((m) => m.message).join("\n") ?? "";

    const prompt = `
    You are an AI chatbot for chat application..
    
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
       "function": {
          "title": "open-chat",
          "chatId": "<ID selected from chatList that best matches the user's request>"
        }
    }
    
    CONDITIONAL FUNCTION RULE:
    - Add the "function" key ONLY IF the user explicitly asks to perform an action
      such as: "open chat", "open this chat", "go to chat", "switch chat".
    - If the user does NOT request an action, DO NOT include the "function" key at all.
    
    
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
    `;

    mutate({ prompt: prompt, model });
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

  return (
    <div className="absolute border bottom-32 right-0 h-[400px]  z-[999] w-[350px] flex flex-col">
      <div className="flex flex-col w-full h-full ">
        {/* top bar */}
        <div className="flex p-5 justify-between w-full bg-[var(--pattern_3)] items-center sticky top-0">
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

        <div className="overflow-y-auto h-full w-full">
          {/* message area  */}
          <Suspense fallback={<Skeleton version="chats" />}>
            <AgentMessage
              messages={messages}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={onDragLeave}
            />
          </Suspense>
        </div>
        {/* message type area */}
        {!activeFeature.toLowerCase().includes("voice") ? (
          <div className="flex w-full gap-2 justify-end items-end h-full">
            <TextArea
              ref={textAreaRef}
              value={input}
              text={debounce}
              preview={preview?.type}
              placeholder={
                preview?.url
                  ? `Enter caption to the ${preview.type}`
                  : `Enter your message`
              }
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
  );
};
export default MiniAgentPanel;
