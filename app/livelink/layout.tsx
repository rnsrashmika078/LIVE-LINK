"use client";
import Sidebar from "../layouts/sidebar/Sidebar";
import { ReactNode, Suspense } from "react";
import { NewChat } from "../component/modal/NewChat";
import React from "react";
import Spinner from "../component/ui/spinner";
import IncomingCall from "../component/ui/communications/IncomingCall";

const MessagePanel = React.lazy(
  () => import("../component/client_component/message/MessagePanel")
);

export default function LiveLinkLayout({ children }: { children: ReactNode }) {

  
  
  return (
    <div className="flex bg-[var(--pattern_1)] w-full h-screen ">
      <Sidebar />
      {children}
      <Suspense fallback={<Spinner />}>
        <MessagePanel />
      </Suspense>
      <Suspense fallback={<div>{null}</div>}>
        <IncomingCall />
      </Suspense>
      <NewChat />
    </div>
  );
}
