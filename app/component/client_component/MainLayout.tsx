"use client";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { PusherChatState } from "@/app/types";
import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import Skeleton from "../ui/skeleton";
import MainPanel from "./MainPanel";
import IncomingCall from "../ui/communications/IncomingCall";
import InfoLayout from "./info/InfoLayout";

const MessagePanel = React.lazy(() => import("./message/MessagePanel"));
const AgentMessagePanel = React.lazy(() => import("./agent/AgentMessagePanel"));
const GroupMessagePanel = React.lazy(
  () => import("./message/GroupMessagePanel")
);
import { AnimatePresence } from "framer-motion";
import MiniAgentPanel from "./agent/MiniAgentPanel";
import AgentWrapper from "./agent/AgentWrapper";

const MainLayout = () => {
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );
  const { actionMenuSelection } = useLiveLink();
  return (
    <>
      <AgentWrapper>
        <MiniAgentPanel />
      </AgentWrapper>

      <Suspense fallback={<Skeleton version="chat" />}>
        {activeChat?.type === "Agent" && <AgentMessagePanel />}
        {activeChat?.type === "Individual" && <MessagePanel />}
        {activeChat?.type === "Group" && <GroupMessagePanel />}
        {!activeChat?.type && <MainPanel />}
      </Suspense>

      <Suspense fallback={<div>{null}</div>}>
        <IncomingCall />
      </Suspense>

      {actionMenuSelection?.selection.toLowerCase().includes("info") && (
        <Suspense fallback={<Skeleton version={"Chat"} />}>
          <InfoLayout />
        </Suspense>
      )}
    </>
  );
};

export default MainLayout;
