/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import TopBar from "@/app/component/client_component/chats/relatedUI/TopBar";
import { useStatusContext } from "@/app/context/StatusContext";
import { PusherChatState } from "@/app/types";
import React, { ReactNode, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";

const StatusLayout = ({ children }: { children: ReactNode }) => {
  const onViewStatus = useSelector(
    (store: PusherChatState) => store.status.onViewStatus
  );
  const { setBack, back } = useStatusContext();

  useEffect(() => {
    if (onViewStatus == null) return;
    setBack((prev) => !prev);
  }, [onViewStatus]);

  const style = back
    ? "w-0 sm:w-[500px]"
    : "w-[calc(100%-3.5rem)] sm:w-[500px]";

  return (
    <div
      className={`${style} absolute sm:relative left-14 sm:left-0  z-[90] h-full`}
    >
      <div className="p-2 absolute">
        <BiArrowBack onClick={() => setBack((prev) => !prev)} />
      </div>
      <div
        className={`z-50 transition-all bg-[var(--pattern_2)] h-full w-full custom-scrollbar-y `}
      >
        <div className=" p-5 justify-center items-center sticky top-0 space-y-2 bg-[var(--pattern_2)]">
          <TopBar
            title="Status"
            subTitle="Check whats up with your friends"
            type="main"
            route=""
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default StatusLayout;
