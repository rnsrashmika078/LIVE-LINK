/* eslint-disable react-hooks/set-state-in-render */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { UserGroupCard } from "@/app/component/ui/cards";
import { GroupType, PusherChatDispatch, PusherChatState } from "@/app/types";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import React from "react";
import { setActiveChat, setGroupChats } from "@/app/lib/redux/chatslicer";
import { useSocket } from "../../util_component/SocketProvider";

const RenderGroupList = ({ initialGroups }: { initialGroups: GroupType[] }) => {
  const [groups, setGroups] = useState<GroupType[]>(initialGroups ?? []);

  //use hooks

  //redux states
  const {
    authUser,
    activeChat,
    liveMessagesArray,
    groupChatsArray,
    activeUsers,
  } = useSelector(
    (store: PusherChatState) => ({
      authUser: store.chat.authUser,
      activeChat: store.chat.activeChat,
      liveMessagesArray: store.chat.messagesArray,
      groupChatsArray: store.chat.groupChats,
      activeUsers: store.chat.activeUsers,
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
    if (groupChatsArray.length) {
      const lastGroupChat = groupChatsArray.at(-1);
      if (!lastGroupChat) return;

      setGroups((prev) => {
        const exist = prev.some((g) => g.chatId === lastGroupChat.chatId);
        if (!exist) {
          return [...prev, lastGroupChat];
        }
        return prev;
      });
    }
  }, [groupChatsArray]);

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
    const lastMessage = liveMessagesArray.at(-1);
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
          seenBy: lastMessage.seenBy,
          updatedAt: lastMessage.createdAt ?? "",
          unreads: lastMessage.unreads,
        };
      })
    );
  }, [liveMessagesArray]);

  useEffect(() => {
    if (!activeChat?.chatId && !authUser?.uid) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.chatId === activeChat?.chatId
          ? {
              ...g,
              unreads: g.unreads?.map((u) =>
                u.userId === authUser?.uid ? { ...u, count: 0 } : u
              ),
            }
          : g
      )
    );
  }, [activeChat?.chatId, authUser?.uid, liveMessagesArray]);

  const socket = useSocket();
  const handleJoinedChat = (group: GroupType) => {
    if (!group || !socket || !authUser) return;

    const payload = {
      userName: authUser.name,
      userId: authUser.uid,
      chatId: group.chatId,
    };
    // new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
    socket.emit("connect-to-chat", payload);
    // });
    dispatch(setActiveChat(group));
  };

  //leaving
  useEffect(() => {
    if (!activeChat?.chatId || !authUser?.uid) return;
    const payload = {
      userName: authUser.name,
      userId: authUser.uid,
      chatId: activeChat.chatId,
    };
    return () => {
      socket?.emit("disconnect-from-chat", payload);
    };
  }, [activeChat?.chatId, authUser?.uid]);

  return (
    <div className="px-5 flex w-full flex-col justify-start items-start">
      <h1 className="text-start w-full text-[#6c6c6c] text-xs">Groups</h1>
      {filteredGroup && filteredGroup?.length > 0 ? (
        filteredGroup.map((group: GroupType, i: number) => {
          return (
            <UserGroupCard
              key={i}
              group={group}
              handleClick={() => handleJoinedChat(group)}
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
