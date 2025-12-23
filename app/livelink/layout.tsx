"use client";
import { ReactNode, Suspense } from "react";
import React from "react";
import Spinner from "../component/ui/spinner";
import IncomingCall from "../component/ui/communications/IncomingCall";
import { useSelector } from "react-redux";
import { PusherChatState } from "../types";
import Skeleton from "../component/ui/skeleton";
import { useLiveLink } from "../context/LiveLinkContext";
import InfoLayout from "../component/client_component/info/InfoLayout";
import MessageInfo from "../component/client_component/info/MessageInfo";

const Sidebar = React.lazy(() => import("../layouts/sidebar/Sidebar"));
const MessagePanel = React.lazy(
  () => import("../component/client_component/message/MessagePanel")
);
const GroupMessagePanel = React.lazy(
  () => import("../component/client_component/message/GroupMessagePanel")
);
const UserSettings = React.lazy(
  () => import("../component/modal/UserSettings")
);

export default function LiveLinkLayout({ children }: { children: ReactNode }) {
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );
  const { currentTab, actionMenuSelection } = useLiveLink();
  return (
    <div className="flex bg-[var(--pattern_1)] w-full h-screen ">
      <Suspense fallback={<Skeleton version="Sidebar" />}>
        <Sidebar />
      </Suspense>
      {children}
      <Suspense fallback={<Skeleton version="chat" />}>
        {/* future: reverse this redundant logic */}
        {activeChat?.type === "Individual" && <MessagePanel />}
        {activeChat?.type === "Group" && <GroupMessagePanel />}
      </Suspense>
      <Suspense fallback={<div>{null}</div>}>
        <IncomingCall />
      </Suspense>
      {/* <Suspense fallback={<div>{null}</div>}>
        {currentTab === "users" && <UserSettings />}
      </Suspense> */}
      {actionMenuSelection?.selection.toLowerCase().includes("info") && (
        <Suspense fallback={<Skeleton version={"Chat"} />}>
          <InfoLayout/>
        </Suspense>
      )}
    </div>
  );
}
