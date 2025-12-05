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
import { formattedDate } from "@/app/util/util";

const ChatPanel = React.memo(() => {
  //use states
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [chatState, setChatState] = useState<ChatsType[]>([]);

  //redux states
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );

  const chatsArray = useSelector(
    (store: PusherChatState) => store.chat.chatArray
  );
  const messageSeen = useSelector(
    (store: PusherChatState) => store.chat.messageSeen
  );
  const liveMessagesArray = useSelector(
    (store: PusherChatState) => store.chat.messagesArray
  );
  const currentTab = useSelector(
    (store: PusherChatState) => store.layout.currentTab
  );

  //redux dispatcher
  const dispatch = useDispatch<PusherChatDispatch>();

  // get Chats ( tanstack )
  const { data, isPending, refetch } = useGetChats(authUser?.uid ?? "");

  //use Effect: add chats to the react state for global access ( initially )
  useEffect(() => {
    const fetcher = () => {
      if (Array.isArray(data?.chats)) {
        dispatch(setChats(data.chats));
        setChatState(data?.chats);
      }
    };
    fetcher();
  }, [data?.chats, dispatch]);

  //Use Effect: for revalidate the data ( refetch ) when chats change for the new Chats
  useEffect(() => {
    const fetcher = () => {
      if (chatsArray?.length) {
        setChatState(chatsArray);
        const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
        wait(1000);
        refetch();
      }
    };
    fetcher();
  }, [chatsArray, chatsArray?.length, refetch]);

  // Use Effect: add last Message to the chats cards
  useEffect(() => {
    if (!liveMessagesArray.length) return;
   
    liveMessagesArray.forEach((msg) => {
      setChatState((prev) => {
        return prev.map((c) =>
          
          c.chatId === msg.chatId
            ? {
                ...c,
                lastMessage: msg.content,
                updatedAt: msg.createdAt,
                status: msg.status,
                senderId: msg.senderId,
              }
            : c
        );
      });
    });
  }, [liveMessagesArray]);

  useEffect(() => {
    const seenStat = () => {
      setChatState((prev) =>
        prev.map((c) =>
          c.chatId === messageSeen?.chatId
            ? { ...c, status: "seen" }
            : c
        )
      );
    };
    seenStat();
  }, [messageSeen]);

  return (
    <div
      className={`z-50 transition-all bg-[var(--pattern_2)] h-full w-full sm:w-96  overflow-y-auto  custom-scrollbar-y `}
    >
      <BaseModal setOpenModal={setOpenModal} openModal={openModal}>
        <NewChat className="pointer-events-auto" />
      </BaseModal>
      <div>{authUser?.createdAt}</div>
      {/* <div> {formattedDate(authUser?.createdAt ?? "")}</div> */}
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
          {chatState &&
            chatState?.map((c: ChatsType, i: number) => (
              <UserCard
                version={3}
                key={i}
                avatar={c.dp}
                createdAt={c.createdAt}
                updatedAt={c.updatedAt}
                senderId={c.senderId}
                status={c.status}
                chatId={c.chatId}
                name={c.name}
                authUserId={authUser?.uid}
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
