/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { UserChatCard } from "@/app/component/ui/cards";
import { ChatsType, PusherChatDispatch, PusherChatState } from "@/app/types";
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

const RenderChatList = ({ initialChats }: { initialChats: ChatsType[] }) => {
  const [chatState, setChatState] = useState<ChatsType[]>(initialChats);

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
      typingUsers: store.chat.typingUsers,
      deletedMessages: store.chat.deletedMessage,
    }),
    shallowEqual
  );

  //redux dispatcher
  const dispatch = useDispatch<PusherChatDispatch>();

  // get Chats ( tanstack )
  const { data: chats, refetch } = useGetChats(
    states.authUser?.uid ?? "",
    connectionState
  );

  const msg = useMemo(
    () => states.liveMessagesArray.at(-1),
    [states.liveMessagesArray]
  );

  //use Effect: add chats to the react state for global access ( initially )
  useEffect(() => {
    if (chats?.length === 0) return;
    if (Array.isArray(chats)) {
      dispatch(setChats(chats));
      setChatState(chats);
    }
  }, [chats, dispatch]);

  //Use Effect: for revalidate the data ( refetch ) when chats change for the new Chats
  useEffect(() => {
    if (!!states.chatsArray?.length) {
      setChatState(states.chatsArray);
      const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
      wait(200);
      refetch();
    }
  }, [states.chatsArray?.length, refetch, states.chatsArray]);

  // update the ( increase ) the unread message count
  // update the chat states to latest message data coming from live socket ( pusher )
  useUnreadCountIncrease(
    msg!,
    setChatState,
    states.activeChat as ChatsType,
    states.authUser!
  );

  //clear count
  useUnreadCountClear(
    setChatState,
    states.activeChat as ChatsType,
    states.authUser!
  );

  //update message seen status ( in this case last messagee status of chat)
  // update the chat states to latest message data coming from live socket ( pusher )
  useUpdateMessageSeenInChat(setChatState, states.messageSeen!);

  //update delete message from the message
  useDeleteMessage("Chat", states.deletedMessages!, setChatState);

  //here get the shallow copy from the chatState -> object are same but the array is change ( new array )
  //new array = new memory address -> but the object inside the array referencing to the same memory address of previous

  // const { data: groups, isPending } = useGetGroups(
  //   states.authUser?.uid ?? "",
  //   connectionState
  // );

  // useEffect(() => {
  //   if (initialGroups.length > 0) setGroupChatStates(initialGroups);
  // }, [initialGroups]);

  // useEffect(() => {
  //   if (groupChatsArray.length) {
  //     const lastGroupChat = groupChatsArray.at(-1);
  //     if (!lastGroupChat) return;

  //     setGroupChatStates((prev) => {
  //       const exist = prev.some((g) => g.groupId === lastGroupChat.groupId);
  //       if (!exist) {
  //         return [...(prev ?? []), lastGroupChat];
  //       }
  //       return prev;
  //     });
  //     // setGroupChatStates((prev) => [...prev, lastGroupChat]);
  //   }
  // }, [groupChatsArray]);

  // const allChats = useMemo(
  //   () => [...(groupChatState ?? []), ...(chatState ?? [])],
  //   [chatState, groupChatState]
  // );



  const filteredChats = useMemo(
    () =>
      [...chatState]?.sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

        return bTime - aTime;
      }),
    [chatState]
  );

  return (
    <div className="px-5 flex w-full flex-col justify-start items-center">
      {filteredChats && filteredChats?.length > 0 ? (
        filteredChats.map((chat: ChatsType, i: number) => {
          return (
            <UserChatCard
              key={i}
              chat={chat}
              handleClick={() => dispatch(setActiveChat(chat))}
            />
          );
        })
      ) : (
        <div>No Chats</div>
      )}
    </div>
  );
};

export default RenderChatList;
