"use client";

import ChatPanel from "@/app/layouts/left_panels/chatpanel";
import { PusherChatState } from "@/app/types";
import { useSelector } from "react-redux";
const ChatsWrapper = () => {
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );
  return (
    <div
      className={` ${
        activeChat?.chatId ? "w-0" : "w-full"
      }  h-screen flex sm:w-auto `}
    >
      <div
        className={` ${
          activeChat?.chatId ? "w-0 sm:w-full " : "w-full"
        } z-20  h-full relative`}
      >
        {/* make w-0 and remove parent w-full*/}
        <ChatPanel />
      </div>
    </div>
  );
};

export default ChatsWrapper;
