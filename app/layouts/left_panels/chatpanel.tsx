"use client";
import { BiEdit, BiFilter } from "react-icons/bi";
import SearchArea from "@/app/component/ui/searcharea";
import { BaseModal, NewChat, UserDetails } from "@/app/component/modal/modal";
import { useEffect, useState } from "react";
import { UserCard } from "@/app/component/ui/cards";
import { ChatsType, PusherChatDispatch, PusherChatState } from "@/app/types";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { setActiveChat, setChats } from "@/app/lib/redux/chatslicer";
import { useGetChats } from "@/app/lib/tanstack/tanstackQuery";
import Spinner from "@/app/component/spinner";
import { useQueryClient } from "@tanstack/react-query";

const ChatPanel = React.memo(() => {
  //use states
  const [openModal, setOpenModal] = useState<boolean>(false);

  //tanstack query Client hook
  const queryClient = useQueryClient();

  //redux states
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );
  const chats = useSelector((store: PusherChatState) => store.chat.chats);
  const liveMessagesArray = useSelector(
    (store: PusherChatState) => store.chat.messagesArray
  );
  const currentTab = useSelector(
    (store: PusherChatState) => store.layout.currentTab
  );

  //redux dispatcher
  const dispatch = useDispatch<PusherChatDispatch>();

  // get Chats ( tanstack )
  const { data, isPending } = useGetChats(authUser?.uid ?? "");

  //use Effect: add chats to the react state for global access ( initially )
  useEffect(() => {
    if (Array.isArray(data?.chats)) {
      dispatch(setChats(data.chats));
    }
  }, [data?.chats, dispatch]);

  //Use Effect: for revalidate the data ( refetch ) when chats change for the new Chats
  useEffect(() => {
    if (chats) {
      queryClient.invalidateQueries({
        queryKey: ["get-chats", authUser?.uid],
      });
    }
  }, [chats, authUser?.uid, queryClient]);

  //Use Effect: add last Message to the chats cards
  useEffect(() => {
    if (!liveMessagesArray.length) return;
    liveMessagesArray.forEach((msg) => {
      dispatch(
        setChats(
          chats.map((c) =>
            c.chatId === msg.chatId ? { ...c, lastMessage: msg.content } : c
          )
        )
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveMessagesArray]);

  return (
    <div
      className={`z-50 transition-all bg-[var(--pattern_2)] h-full w-full sm:w-96  overflow-y-auto  custom-scrollbar-y `}
    >
      <BaseModal setOpenModal={setOpenModal} openModal={openModal}>
        <NewChat className="pointer-events-auto" />
      </BaseModal>
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
        <Spinner condition={isPending} />
        <div className="px-5 flex w-full flex-col justify-start items-center">
          {chats &&
            chats?.map((c: ChatsType, i: number) => (
              <UserCard
                version={3}
                key={i}
                avatar={c.dp}
                created_at={new Date().toLocaleTimeString()}
                chatId={c.chatId}
                name={c.name}
                className={
                  activeChat?.chatId === c.chatId ? "bg-[var(--pattern_5)]" : ""
                }
                lastMessage={c.lastMessage}
                handleClick={() => {
                  dispatch(setActiveChat(c));
                }}
              />
            ))}
        </div>
      </div>
      {currentTab === "users" && <UserDetails />}
    </div>
  );
});

ChatPanel.displayName = "ChatPanel";
export default ChatPanel;
