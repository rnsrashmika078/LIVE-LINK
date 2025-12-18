/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ChatsType, GroupType, PusherChatState } from "@/app/types";
import { useSelector } from "react-redux";
import ChatLayout from "./ChatLayout";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { NewChat } from "./NewChat";
import CreateNewGroup from "./CreateNewGroup";
import { AddNewFriend } from "./AddNewFriend";
import RenderChatList from "./RenderChatList";
import RenderGroupList from "./RenderGroupList";

const ChatListClient = ({
  chats,
  groupChats,
}: {
  chats: ChatsType[];
  groupChats: GroupType[];
}) => {
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );
  const { internalClickState } = useLiveLink();

  return (
    <div
      className={` ${
        activeChat?.chatId ? "w-0" : "w-full"
      }  h-screen flex sm:w-auto `}
    >
      <div
        className={`${
          activeChat?.chatId ? "w-0 sm:w-full " : "w-full"
        } z-20  h-full relative`}
      >
        <ChatLayout>
          {internalClickState.toLowerCase() === "chats" && (
            <div className="w-full">
              <RenderChatList initialChats={chats} />
              <RenderGroupList initialGroups={groupChats} />
            </div>
          )}

          {internalClickState.toLowerCase() === "edit" && <NewChat />}
          {internalClickState.toLowerCase() === "create group" && (
            <CreateNewGroup />
          )}
          {internalClickState.toLowerCase() === "add friend" && (
            <AddNewFriend />
          )}
        </ChatLayout>
      </div>
      {/* make w-0 and remove parent w-full*/}
    </div>
  );
};

export default ChatListClient;
