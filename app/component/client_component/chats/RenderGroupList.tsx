/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { UserChatCard, UserGroupCard } from "@/app/component/ui/cards";
import {
  ChatsType,
  GroupType,
  PusherChatDispatch,
  PusherChatState,
} from "@/app/types";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import React from "react";
import { setActiveChat, setChats } from "@/app/lib/redux/chatslicer";
import { useGetChats } from "@/app/lib/tanstack/chatsQuery";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import {
  useUnreadCountClear,
  useUnreadCountIncrease,
  useUpdateMessageSeenInChat,
} from "@/app/hooks/CustomHooks/chatEffectHook";
import { useDeleteMessage } from "@/app/hooks/CommonEffectHooks";

const RenderGroupList = ({ initialGroups }: { initialGroups: GroupType[] }) => {
  const [groups, setGroups] = useState<GroupType[]>(initialGroups);

  //use hooks
  const { connectionState } = useLiveLink();



  //redux states
  const states = useSelector(
    (store: PusherChatState) => ({
      authUser: store.chat.authUser,
      activeChat: store.chat.activeChat,
      chatsArray: store.chat.chatArray,
      messageSeen: store.chat.messageSeen,
      liveMessagesArray: store.chat.messagesArray,
      currentTab: store.layout.currentTab,
      debounce: store.chat.debouncedText,
      unreads: store.chat.unreads,
      groupChatsArray: store.chat.groupChats,
      deletedMessages: store.chat.deletedMessage,
    }),
    shallowEqual
  );

  //redux dispatcher
  const dispatch = useDispatch<PusherChatDispatch>();

  useEffect(() => {
    if (initialGroups.length > 0) setGroups(initialGroups);
  }, [initialGroups]);

  useEffect(() => {
    if (states.groupChatsArray.length) {
      const lastGroupChat = states.groupChatsArray.at(-1);
  console.log("last groups" , states.groupChatsArray)

      if (!lastGroupChat) return;

      setGroups((prev) => {
        const exist = prev.some((g) => g.chatId === lastGroupChat.chatId);
        if (!exist) {
          return [...prev, lastGroupChat];
        }
        return prev;
      });
      // setGroupChatStates((prev) => [...prev, lastGroupChat]);
    }
  }, [states.groupChatsArray]);

  const filteredGroup = useMemo(
    () =>
      [...groups]?.sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

        return bTime - aTime;
      }),
    [groups]
  );
  console.log("states groups" , states.groupChatsArray)

  console.log("groups" , groups)
  return (
    <div className="px-5 flex w-full flex-col justify-start items-center">
      {filteredGroup && filteredGroup?.length > 0 ? (
        filteredGroup.map((group: GroupType, i: number) => {
          return (
            <UserGroupCard
              key={i}
              group={group}
              handleClick={() => dispatch(setActiveChat(group))}
            />
          );
        })
      ) : (
        <div>No Chats</div>
      )}
    </div>
  );
};

export default RenderGroupList;
