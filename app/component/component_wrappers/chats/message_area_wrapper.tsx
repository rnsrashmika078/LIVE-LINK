"use client";
import { MessageArea } from "@/app/layouts/right-panels/message_panel";
import { store } from "@/app/lib/redux/store";
import { PusherChatState } from "@/app/types";
import { useSelector } from "react-redux";

const MessageAreaWrapper = () => {
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );
  return (
    <div
      className={`${activeChat?.chatId ? "block" : "hidden"} w-full  sm:block`}
    >
      {/* remove hidden */}
      <MessageArea />
    </div>
  );
};

export default MessageAreaWrapper;
