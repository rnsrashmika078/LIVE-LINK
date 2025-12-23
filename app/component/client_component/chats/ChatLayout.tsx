"use client";
import SearchArea from "@/app/component/ui/searcharea";
import React, { ReactNode, useState } from "react";
import TopBar from "./relatedUI/TopBar";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { BiSync } from "react-icons/bi";

import { useRouter } from "next/navigation";
import UserSettings from "../../modal/UserSettings";

const ChatLayout = React.memo(({ children }: { children: ReactNode }) => {
  const { internalClickState, setInternalClickState } = useLiveLink();
  const handleOnSearch = (value: string) => {};
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  return (
    <div
      className={`z-50 transition-all bg-[var(--pattern_2)] h-full md:w-90  custom-scrollbar-y `}
    >
      {/* top */}
      {internalClickState === "chats" && (
        <div className=" p-5 justify-center items-center sticky top-0 space-y-2   bg-[var(--pattern_2)]">
          <TopBar
            title="Chats"
            subTitle="Individual chats and group chats"
            type="first"
            route=""
            callback={setInternalClickState}
          />
          <SearchArea
            placeholder="Search or start a new chat"
            onSearch={handleOnSearch}
          />
          <BiSync
            className={`${isSyncing ? "animate-spin" : ""}`}
            size={20}
            onClick={async () => {
              setIsSyncing(true);
              router.push(`/livelink/chats`);
              await new Promise((resolve) => setTimeout(resolve, 2000));
              setIsSyncing(false);
            }}
          />
        </div>
      )}
      {internalClickState === "users" && (
        <>
          <UserSettings />
        </>
      )}
      {/* body - content */}
      {children}

      {/* bottom */}
      {/* {states.currentTab === "users" && <UserSettings />} */}
    </div>
  );
});

ChatLayout.displayName = "ChatLayout";
export default ChatLayout;
