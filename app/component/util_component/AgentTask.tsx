"use client";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { parse } from "jsonc-parser";
import { useEffect } from "react";
const AgentTask = () => {
  const { agentTask, chatRefs } = useLiveLink();
  const handler = () => {
    try {
      const data = parse(agentTask);
      if (!data) return;
      if (!data.function) return;
      console.log(data.function.chatId);
      // if (!chatRefs.current[data.function.chatId]) return;
      chatRefs.current[data.function.chatId]?.click();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!agentTask) return;
    handler();
  }, [agentTask]);

  return null;
};

export default AgentTask;
