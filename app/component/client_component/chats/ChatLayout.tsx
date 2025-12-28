/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import SearchArea from "@/app/component/ui/searcharea";
import React, { ReactNode, useEffect, useState } from "react";
import TopBar from "./relatedUI/TopBar";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { BiArrowBack, BiSync } from "react-icons/bi";
import { useRouter } from "next/navigation";
import UserSettings from "../../modal/UserSettings";
import { PusherChatState } from "@/app/types";
import { useSelector } from "react-redux";

const ChatLayout = React.memo(({ children }: { children: ReactNode }) => {
  const { internalClickState, setInternalClickState } = useLiveLink();
  const handleOnSearch = (value: string) => {};
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );
  const [back, setBack] = useState<boolean>(true);

  useEffect(() => {
    setBack((prev) => !prev);
  }, [activeChat]);

  const style = back
    ? "w-0 sm:w-[500px]"
    : "w-[calc(100%-3.5rem)] sm:w-[500px]";

  return (
    <div
      className={`${style} absolute sm:relative left-14 sm:left-0  z-[90] h-full`}
    >
      <div className="p-5 mt-20 absolute">
        <BiArrowBack onClick={() => setBack((prev) => !prev)} />
      </div>
      <div
        className={`z-50 transition-all bg-[var(--pattern_2)] h-full w-full custom-scrollbar-y `}
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
        {children}
      </div>
    </div>
  );
});

ChatLayout.displayName = "ChatLayout";
export default ChatLayout;
