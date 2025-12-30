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
import { MessagePanelIcons } from "@/app/util/data";
import VoiceRecorder from "../../ui/communications/Voice";
import { useVoiceMessage } from "@/app/context/VoiceMessageContext";
import Skeleton from "../../ui/skeleton";
import AgentMessage from "../../agent_component/AgentMessage";
import { useAgent } from "@/app/lib/tanstack/agentQuery";
import DropDown, { DropDownItem } from "../../ui/dropdown";
const AgentMessagePanel = () => {
  const [messages, setMessages] = useState<AgentType[]>([]);
  const [input, setInput] = useState<string>("");
  const [activeFeature, setActiveFeature] = useState<string>(""); // fo
  const [model, setModel] = useState<string>("llama3.2:latest");

  const { setClickedIcon, clickedIcon, setActionMenuSelection, setAgentTask } =
    useLiveLink();
  const { blobRef } = useVoiceMessage();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const { activeChat, authUser } = useSelector(
    (store: PusherChatState) => ({
      activeChat: store.chat.activeChat as ChatsType,
      authUser: store.chat.authUser,
    }),
    shallowEqual
  );

  const debounce = useDebounce(input, 200);
  const { mutate } = useAgent((message) => {
    if (message) {
      alert(JSON.stringify(message));
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

  useEffect(() => {
    setMessages([]);
    setInput("");
    // debounce = "";
    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }
  }, [activeChat?.chatId]);

  const sendMessage = () => {
    setMessages((prev) => [...prev, { type: "user", message: debounce }]);
    const latestMessage = debounce.replace(/[\r\n]+/g, " ");
    const history = messages?.map((m) => m.message).join("\n") ?? "";

    const prompt = `
    You are a chatbot. Respond ONLY to the user query, concisely and clearly.
    Do NOT reason, explain, or add extra text.
    
    - ALWAYS return a single-line, valid JSON object.
    - Use this exact format:
      {"title":"<short descriptive title>","answer":"<full reply content in Markdown>" , "function": "<{title: "open-chat",chatId:"<id from the chatList match the users prompt>"}
    - function key's pairs are another json object as above mentioned
    - that function key use to trigger the open chat according to the user input
    - chatList : ["IZzoL4eNf5fprlpLp5Up59XwlPC2-Vc5pftz3lmXNSZvHoQy5HmAowb53","IZzoL4eNf5fprlpLp5Up59XwlPC2-Mjq7j4WY1hWsQ7lJ8bqfI3h8zI93",]
    - NEVER return an empty message.
    - The "answer" field must preserve Markdown formatting (headings, bullet points, code blocks, etc.) but remain valid JSON.
    
    User query: "${latestMessage}"
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
              <Avatar image={activeChat?.dp || "/no_avatar2.png"} />
              <div className="w-full">
                <h1 className="">{activeChat?.name}</h1>
                <p className="text-xs text-[var(--pattern_4)]">Online</p>
              </div>
            </div>
            <AppIcons iconArray={MessagePanelIcons} callback={setClickedIcon} />
          </div>

          <Suspense fallback={<Skeleton version="chats" />}>
            <AgentMessage
              messages={messages}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={onDragLeave}
            />
          </Suspense>

          {/* Communication Component */}
          {clickedIcon === "search" && (
            <div className="">
              <SearchArea />
            </div>
          )}

          <div className="flex flex-col gap-5 mt-auto w-full p-2 place-items-start ">
            {/* <TypingIndicator UserTyping={UserTyping!} version="1" /> */}
            <FileShare
              isDragging={isDragging}
              preview={preview}
              setPreview={setPreview}
              setFile={setFile}
            />

            <div className="flex w-full gap-2 place-items-center">
              {!activeFeature.toLowerCase().includes("voice") ? (
                <div className="flex w-full gap-2">
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
                  <DropDown onSelect={(val) => setModel(val)}>
                    <DropDownItem value="llama3.2:latest"></DropDownItem>
                    <DropDownItem value="Gemini 2.5-flash" />
                    <DropDownItem value="Qwen-B3" selectDefault={true} />
                  </DropDown>
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
