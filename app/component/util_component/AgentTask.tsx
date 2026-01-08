"use client";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { ScheduleMessageAT } from "@/app/helper/agentTasks";
import { useSaveMessage } from "@/app/lib/tanstack/messageQuery";
import { PusherChatState } from "@/app/types";
import { parse } from "jsonc-parser";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
const AgentTask = () => {
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const { agentTask, chatRefs } = useLiveLink();

  const { mutate } = useSaveMessage((result) => {
    console.log("result", result);
  });

  const handler = useCallback(() => {
    try {
      const data = parse(agentTask);

      if (!data) return;
      if (data.function.title.includes("open-chat")) {
        chatRefs.current[data.function.chatId]?.click();
      } else if (
        data.function.title.includes("scheduler") ||
        data.function.title.includes("Schedule Message")
      ) {
        console.log("ai data", data);
        ScheduleMessageAT(
          data.function.message,
          authUser,
          data.function.chatId,
          true,
          data.function.time,
          "Offline",
          (p) => {
            console.log("payload", p);
            mutate({ message: p });
          }
        );
      } else {
        console.log("test");
      }
    } catch (err) {
      console.log(err);
    }
  }, [agentTask, authUser, chatRefs, mutate]);

  useEffect(() => {
    console.log("agent task re render!");
    if (!agentTask) return;
    handler();
  }, [agentTask]);

  return null;
};

export default AgentTask;
