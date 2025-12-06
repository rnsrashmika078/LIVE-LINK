"use client";
import { BiEdit, BiFilter } from "react-icons/bi";
import SearchArea from "@/app/component/ui/searcharea";
import { BaseModal, NewChat, UserDetails } from "@/app/component/modal/modal";
import { useEffect, useMemo, useState } from "react";
import { UserCard } from "@/app/component/ui/cards";
import {
  ChatsType,
  PusherChatDispatch,
  PusherChatState,
  Unread,
} from "@/app/types";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import {
  setActiveChat,
  setChats,
  setUnreads,
} from "@/app/lib/redux/chatslicer";
import { useGetChats } from "@/app/lib/tanstack/tanstackQuery";
import Spinner from "@/app/component/spinner";
import { formattedDate } from "@/app/util/util";

const ChatPanel = React.memo(() => {
  //use states
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [chatState, setChatState] = useState<ChatsType[]>([]);
  const [unreadsState, setUnreadState] = useState<
    { chatId: string; userId: string; count: number }[]
  >([]);

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
  const msg = useMemo(() => liveMessagesArray.at(-1), [liveMessagesArray]);

  //use Effect: add chats to the react state for global access ( initially )
  useEffect(() => {
    if (data?.chats.length === 0) return;
    console.log("🤗");
    if (Array.isArray(data?.chats)) {
      dispatch(setChats(data.chats));
      setChatState(data?.chats);
    }
  }, [data?.chats, dispatch]);

  //Use Effect: for revalidate the data ( refetch ) when chats change for the new Chats
  //heavy test needed for this -> for now it keep there
  useEffect(() => {
    if (chatsArray?.length) {
      console.log("🟢");
      setChatState(chatsArray);
      const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
      wait(1000);
      refetch();
    }
  }, [chatsArray, chatsArray?.length, refetch]);

  // Use Effect: stop update ( increase ) unread message if current chat is open
  useEffect(() => {
    if (!msg) return;
    console.log("🟣");

    setChatState((prev) =>
      prev.map((chat) => {
        if (activeChat?.chatId === chat?.chatId && chat.chatId === msg.chatId)
          return {
            ...chat,
            lastMessage: msg.content,
            updatedAt: msg.createdAt,
            senderId: msg.senderId,
            status: msg.status,
            unreadCount: [],
          };
        return chat;
      })
    );
  }, [activeChat?.chatId, msg]);

  // Use Effect: update the ( increase ) the unread message count

  useEffect(() => {
    if (!msg) return;
    console.log("🟠");
    setChatState((prev) =>
      prev.map((chat) => {
        if (chat.chatId !== msg.chatId) {
          return chat;
        }
        //check if live message ( msg ) is for me
        const isMsgToMe = msg.senderId === authUser?.uid;

        const previous =
          chat?.unreadCount?.find((u) => u.userId === authUser?.uid)?.count ||
          0;

        return {
          ...chat,
          lastMessage: msg.content,
          updatedAt: msg.createdAt,
          senderId: msg.senderId,
          status: msg.status,
          unreadCount: isMsgToMe
            ? []
            : activeChat?.chatId === chat?.chatId && chat.chatId === msg.chatId
            ? []
            : [{ userId: authUser?.uid ?? " ", count: previous + 1 }],
        };
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.uid, msg]);

  //use Effect: clear count
  useEffect(() => {
    if (!activeChat?.chatId || !authUser?.uid) return;
    console.log("🟢");
    setChatState((prev) =>
      prev.map((chat) => {
        if (chat.chatId !== activeChat?.chatId) return chat;

        return {
          ...chat,
          unreadCount: chat.unreadCount?.map((c) =>
            c.userId === authUser?.uid ? { ...c, count: 0 } : c
          ),
        };
      })
    );
  }, [activeChat?.chatId, authUser?.uid]);

  //use Effect: update message seen status ( in this case last messagee status of chat)
  useEffect(() => {
    if (!messageSeen.chatId) return;
    console.log("🟡");

    setChatState((prev) =>
      prev.map((c) =>
        c.chatId === messageSeen?.chatId ? { ...c, status: "seen" } : c
      )
    );
  }, [messageSeen.chatId]);

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
            chatState?.map((c: ChatsType, i: number) => {
              return (
                <UserCard
                  version={3}
                  avatar={c.dp}
                  key={c.chatId}
                  createdAt={c.createdAt}
                  updatedAt={c.updatedAt}
                  senderId={c.senderId}
                  status={c.status}
                  chatId={c.chatId}
                  unreadCount={c.unreadCount}
                  name={c.name}
                  authUserId={authUser?.uid}
                  className={
                    activeChat?.chatId === c.chatId
                      ? "bg-[var(--pattern_5)]"
                      : ""
                  }
                  lastMessage={c.lastMessage}
                  handleClick={() => {
                    dispatch(setActiveChat(c));
                  }}
                />
              );
            })}
        </div>
      </div>
      {currentTab === "users" && <UserDetails />}
    </div>
  );
});

ChatPanel.displayName = "ChatPanel";
export default ChatPanel;
