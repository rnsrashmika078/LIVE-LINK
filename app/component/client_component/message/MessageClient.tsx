"use client";
import { PusherChatState } from "@/app/types";
import { useSelector } from "react-redux";
import MessagePanel from "./MessagePanel";

const MessageClient = () => {
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );
  return (
    <div
      className={`${activeChat?.chatId ? "block" : "hidden"} w-full  sm:block`}
    >
      {/* remove hidden */}
      <MessagePanel />
    </div>
  );
};

export default MessageClient;
