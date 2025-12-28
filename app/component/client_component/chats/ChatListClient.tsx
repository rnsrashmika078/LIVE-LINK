/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ChatsType, GroupType, PusherChatState } from "@/app/types";
import { useSelector } from "react-redux";
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
  const { internalClickState } = useLiveLink();

  return (
    <>
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
      {internalClickState.toLowerCase() === "add friend" && <AddNewFriend />}
    </>
  );
};

export default ChatListClient;
