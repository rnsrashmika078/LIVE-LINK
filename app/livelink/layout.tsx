"use client";
import Sidebar from "../layouts/sidebar/Sidebar";
import LiveLink from "../context/LiveLinkContext";
import { ReactNode } from "react";
import { NewChat } from "../component/modal/modal";
import React from "react";

const MessagePanel = React.lazy(() => import("../component/client_component/message/MessagePanel"))

export default function LiveLinkLayout({ children }: { children: ReactNode }) {
  return (
    <LiveLink>
      <div className="flex bg-[var(--pattern_1)] w-full h-screen ">
        <Sidebar />
        {children}
        <MessagePanel />
        <NewChat />
      </div>
    </LiveLink>
  );
}
