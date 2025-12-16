/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { BiEdit, BiFilter } from "react-icons/bi";
import SearchArea from "@/app/component/ui/searcharea";
import { NewChat, UserDetails } from "@/app/component/modal/NewChat";
import { useEffect, useMemo, useState } from "react";
import { UserChatCard } from "@/app/component/ui/cards";
import { ChatsType, PusherChatDispatch, PusherChatState } from "@/app/types";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import React from "react";
import { setActiveChat, setChats } from "@/app/lib/redux/chatslicer";
import Spinner from "@/app/component/ui/spinner";

import { useGetChats } from "@/app/lib/tanstack/chatsQuery";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import {
  useUnreadCountClear,
  useUnreadCountIncrease,
  useUpdateMessageSeenInChat,
} from "@/app/hooks/CustomHooks/chatEffectHook";
import { useDeleteMessage } from "@/app/hooks/CommonEffectHooks";

const ChatPanel = React.memo(
  ({ initialChats }: { initialChats: ChatsType[] }) => {
    //use states
    // const [openModal, setOpenModal] = useState<boolean>(false);
    const [chatState, setChatState] = useState<ChatsType[]>(initialChats);
    // const [isPending, setIsPending] = useState(
    //   initialChats.length === 0  ? f
    // );

    //use hooks
    const { openModal, setOpenModal, connectionState } = useLiveLink();

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
        deletedMessages: store.chat.deletedMessage,
      }),
      shallowEqual
    );

    //redux dispatcher
    const dispatch = useDispatch<PusherChatDispatch>();

    // get Chats ( tanstack )
    const { data, refetch } = useGetChats(
      states.authUser?.uid ?? "",
      connectionState
    );
    const msg = useMemo(
      () => states.liveMessagesArray.at(-1),
      [states.liveMessagesArray]
    );

    //use Effect: add chats to the react state for global access ( initially )
    useEffect(() => {
      if (data?.chats.length === 0) return;
      if (Array.isArray(data?.chats)) {
        dispatch(setChats(data.chats));
        setChatState(data?.chats);
      }
    }, [data?.chats, dispatch]);

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
      states.activeChat!,
      states.authUser!
    );

    //clear count
    useUnreadCountClear(setChatState, states.activeChat!, states.authUser!);

    // //stop update ( increase ) unread message if current chat is open
    // useUnreadCountStop(msg!, setChatState, states.activeChat!);

    //update message seen status ( in this case last messagee status of chat)
    // update the chat states to latest message data coming from live socket ( pusher )
    useUpdateMessageSeenInChat(setChatState, states.messageSeen!);

    //update delete message from the message
    useDeleteMessage("Chat", states.deletedMessages!, setChatState);

    //here get the shallow copy from the chatState -> object are same but the array is change ( new array )
    //new array = new memory address -> but the object inside the array referencing to the same memory address of previous

    const chats = useMemo(() => {
      if (chatState && chatState?.length > 0) {
        [...chatState]?.sort((a, b) => {
          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

          return bTime - aTime;
        });
      }
      return [];
    }, [chatState]);

    return (
      <div
        className={`z-50 transition-all bg-[var(--pattern_2)] h-full w-full sm:w-90  custom-scrollbar-y `}
      >
        {/* {states.deletedMessages.map((d, index) => (
          <div
            key={index}
            className="z-[999] bg-red-500 flex text-center w-full flex-col fixed top-10 left-1/2 -translate-x-1/2"
          >
            <div> CHAT ID {d.chatId}</div>
            <div> MESSAGE ID {d.messageId}</div>
          </div>
        ))}
        {chatState.map((d, index) => (
          <div
            key={index}
            className="z-[999] bg-green-500 flex text-center w-full flex-col fixed bottom-10 left-1/2 -translate-x-1/2"
          >
            <div> CHAT ID {d.chatId}</div>
            <div> LAST MESSAGE ID {d.lastMessageId}</div>
          </div>
        ))} */}
        <div>{states.authUser?.createdAt}</div>
        <div className=" space-y-2 relative ">
          <div className=" p-5 justify-center items-center  sticky top-0 space-y-2  bg-[var(--pattern_2)]">
            <div className=" flex justify-between items-center ">
              <h1 className="header">Chats</h1>
              <div className="flex gap-4 ">
                <BiEdit
                  onClick={() => setOpenModal(!openModal)}
                  size={30}
                  className="hover:bg-[var(--pattern_5)] p-1 rounded-md"
                />
                <BiFilter
                  size={30}
                  className="hover:bg-[var(--pattern_5)] p-1 rounded-md"
                />
              </div>
            </div>
            <SearchArea placeholder="Search or start a new chat" />
          </div>
          {/* <Spinner condition={isPending} /> */}

          <div className="px-5 flex w-full flex-col justify-start items-center">
            {chats && chats.length > 0 ? (
              chats.map((chat: ChatsType, i: number) => {
                return (
                  <UserChatCard
                    key={chat.chatId}
                    chat={chat}
                    handleClick={() => dispatch(setActiveChat(chat))}
                  />
                );
              })
            ) : (
              <div>No Chats</div>
            )}
          </div>
        </div>
        {states.currentTab === "users" && <UserDetails />}
      </div>
    );
  }
);

ChatPanel.displayName = "ChatPanel";
export default ChatPanel;
