"use client";
import Sidebar from "../layouts/sidebar/Sidebar";
import { ReactNode, Suspense } from "react";
import React from "react";
import Spinner from "../component/ui/spinner";
import IncomingCall from "../component/ui/communications/IncomingCall";
import { useSelector } from "react-redux";
import { PusherChatState } from "../types";
import Skeleton from "../component/ui/skeleton";

const MessagePanel = React.lazy(
  () => import("../component/client_component/message/MessagePanel")
);
const GroupChatPanel = React.lazy(
  () => import("../component/client_component/message/GroupMessagePanel")
);

export default function LiveLinkLayout({ children }: { children: ReactNode }) {
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );
  return (
    <div className="flex bg-[var(--pattern_1)] w-full h-screen ">
      <Sidebar />
      {children}
      <Suspense fallback={<Skeleton />}>
        {/* future: reverse this redundant logic */}
        {activeChat?.type === "Individual" && <MessagePanel />}
        {activeChat?.type === "Group" && <GroupChatPanel />}
      </Suspense>
      <Suspense fallback={<div>{null}</div>}>
        <IncomingCall />
      </Suspense>
    </div>
  );
}
