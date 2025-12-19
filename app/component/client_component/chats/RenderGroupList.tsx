/* eslint-disable react-hooks/set-state-in-render */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { UserGroupCard } from "@/app/component/ui/cards";
import { GroupType, PusherChatDispatch, PusherChatState } from "@/app/types";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import React from "react";
import { setActiveChat, setGroupChats } from "@/app/lib/redux/chatslicer";
import { useLiveLink } from "@/app/context/LiveLinkContext";

const RenderGroupList = ({ initialGroups }: { initialGroups: GroupType[] }) => {
  const [groups, setGroups] = useState<GroupType[]>(initialGroups ?? []);

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
    if (initialGroups?.length > 0) {
      dispatch(setGroupChats(initialGroups));
      setGroups(initialGroups);
    }
  }, [initialGroups]);

  //check whether the new chat is already exist on Groups state old chat array
  useEffect(() => {
    if (states.groupChatsArray.length) {
      const lastGroupChat = states.groupChatsArray.at(-1);
      if (!lastGroupChat) return;

      setGroups((prev) => {
        const exist = prev.some((g) => g.chatId === lastGroupChat.chatId);
        if (!exist) {
          return [...prev, lastGroupChat];
        }
        return prev;
      });
    }
  }, [states.groupChatsArray]);

  const filteredGroup = useMemo(
    () =>
      [...(groups ?? [])].sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

        return bTime - aTime;
      }),
    [groups]
  );

  useEffect(() => {
    const lastMessage = states.liveMessagesArray.at(-1);
    if (!lastMessage) return;
    setGroups((prev) =>
      prev.map((g) => {
        if (g.chatId !== lastMessage.chatId) return g;
        return {
          ...g,
          lastMessage: {
            name: lastMessage.senderInfo?.senderName ?? "mother fucker",
            message: lastMessage.content,
          },
          updatedAt: lastMessage.createdAt ?? "",
        };
      })
    );
  }, [states.liveMessagesArray]);

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
