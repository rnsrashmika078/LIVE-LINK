/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Avatar from "@/app/component/ui/avatar";
import { useDebounce } from "@/app/hooks/useHooks";
import React, { Suspense, useEffect, useState } from "react";
import { TextArea } from "@/app/component/ui/textarea";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import AppIcons from "../../ui/icons";
import { agent, MessagePanelIcons, refinePrompt } from "@/app/util/data";
import VoiceRecorder from "../../ui/communications/Voice";
import { useVoiceMessage } from "@/app/context/VoiceMessageContext";
import Skeleton from "../../ui/skeleton";
import AgentMessage from "../../agent_component/AgentMessage";
import { useAgent } from "@/app/lib/tanstack/agentQuery";
import { useAgentContext } from "@/app/context/AgentContext";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { ChatsType, GroupType, PusherChatState } from "@/app/types";
import { v4 as uuid } from "uuid";

const MiniAgentPanel = () => {
  const { messages, setMessages } = useAgentContext();
  const [input, setInput] = useState<string>("");
  const [activeFeature, setActiveFeature] = useState<string>("");

  const groupChats = useSelector(
    (store: PusherChatState) => store.chat.groupChats as GroupType[]
  );
  const authUserName = useSelector(
    (store: PusherChatState) => store.chat.authUser?.name
  );
  const indChats = useSelector(
    (store: PusherChatState) => store.chat.chats as ChatsType[]
  );

  const { setClickedIcon, setActionMenuSelection, setAgentTask } =
    useLiveLink();
  const { blobRef } = useVoiceMessage();

  const debounce = useDebounce(input, 200);

  const { mutate } = useAgent((message) => {
    if (message) {
      setAgentTask(message);

      //stream effect

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

    const chatsData = indChats.map((i) => ({
      chatId: i.chatId,
      name: i.name,
    }));
    const groupData = groupChats.map((g) => ({
      chatId: g.chatId,
      groupName: g.groupName,
    }));

    const prompt = `${refinePrompt}
    USER QUERY:
    "${latestMessage}" 
    CHAT HISTORY : ${JSON.stringify(messages)}
    INDIVIDUAL CHATS LIST : ${JSON.stringify(chatsData)}
    GROUP CHATS LIST : ${JSON.stringify(groupData)}
    
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100, x: -200 }}
      exit={{ opacity: 0, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed border rounded-2xl border-[#323232] shadow-md -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rotate-90 h-[400px]  z-[999] w-[350px] flex flex-col"
    >
      <div className="flex flex-col w-full h-full pattern_1 rounded-2xl">
        {/* top bar */}
        <div className="flex p-5 justify-between rounded-t-2xl w-full bg-[var(--pattern_3)] items-center sticky top-0">
          <div
            className=" flex items-center gap-3"
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

        <div className="overflow-y-auto h-full  w-full">
          {/* message area  */}
          <Suspense fallback={<Skeleton version="chats" />}>
            <AgentMessage messages={messages} />
          </Suspense>
        </div>
        {/* message type area */}
        {!activeFeature.toLowerCase().includes("voice") ? (
          <div className="flex w-full gap-2 justify-end items-end  p-2">
            <TextArea
              visible={false}
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
    </motion.div>
  );
};
export default MiniAgentPanel;
