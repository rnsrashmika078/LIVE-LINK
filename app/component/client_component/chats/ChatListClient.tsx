"use client";

import { ChatsType, PusherChatState } from "@/app/types";
import { useSelector } from "react-redux";
import ChatListPanel from "./ChatListPanel";

const ChatListClient = ({ chats }: { chats: ChatsType[] }) => {
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
        <ChatListPanel initialChats={chats} />
      </div>
    </div>
  );
};

export default ChatListClient;
