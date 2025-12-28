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
  const { connectionState,  } = useLiveLink();

  //redux states
  const {
    activeChat,
    authUser,
    chatsArray,
    messageSeen,
    liveMessagesArray,
    deletedMessages,
  } = useSelector(
    (store: PusherChatState) => ({
      authUser: store.chat.authUser,
      activeChat: store.chat.activeChat,
      chatsArray: store.chat.chatArray,
      messageSeen: store.chat.messageSeen,
      liveMessagesArray: store.chat.messagesArray,
      deletedMessages: store.chat.deletedMessage,
    }),
    shallowEqual
  );

  //redux dispatcher
  const dispatch = useDispatch<PusherChatDispatch>();

  // get Chats ( tanstack )
  const { data: chats, refetch } = useGetChats(
    authUser?.uid ?? "",
    connectionState
  );

  const msg = useMemo(() => liveMessagesArray.at(-1), [liveMessagesArray]);

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
    if (!!chatsArray?.length) {
      setChatState(chatsArray);
      const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
      wait(200);
      refetch();
    }
  }, [chatsArray?.length, refetch, chatsArray]);

  // update the ( increase ) the unread message count
  // update the chat states to latest message data coming from live socket ( pusher )
  useUnreadCountIncrease(
    msg!,
    setChatState,
    activeChat as ChatsType,
    authUser!
  );

  //clear count
  useUnreadCountClear(setChatState, activeChat as ChatsType, authUser!);

  //update message seen status ( in this case last messagee status of chat)
  // update the chat states to latest message data coming from live socket ( pusher )
  useUpdateMessageSeenInChat(setChatState, messageSeen!);

  //update delete message from the message
  useDeleteMessage("Chat", deletedMessages!, setChatState);

  const filteredChats = useMemo(() => {
    if (!chatState?.length) return [];
    return [...chatState]?.sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

      return bTime - aTime;
    });
  }, [chatState]);

  
  return (
    <div className="px-5 flex w-full flex-col justify-start items-start ">
      <p className="sub-styles">
        Individual Chats
      </p>
      {filteredChats && filteredChats?.length > 0 ? (
        filteredChats.map((chat: ChatsType, i: number) => {
          return (
            <UserChatCard
              key={i}
              chat={chat}
              handleClick={() => {
                dispatch(setActiveChat(chat));
              }}
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
