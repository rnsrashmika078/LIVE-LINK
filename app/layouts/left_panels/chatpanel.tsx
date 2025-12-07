"use client";
import { BiEdit, BiFilter } from "react-icons/bi";
import SearchArea from "@/app/component/ui/searcharea";
import { BaseModal, NewChat, UserDetails } from "@/app/component/modal/modal";
import { useEffect, useMemo, useState } from "react";
import { UserCard } from "@/app/component/ui/cards";
import { ChatsType, PusherChatDispatch, PusherChatState } from "@/app/types";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import React from "react";
import { setActiveChat, setChats } from "@/app/lib/redux/chatslicer";
import { useGetChats } from "@/app/lib/tanstack/tanstackQuery";
import Spinner from "@/app/component/spinner";
import { useOnlinePresence } from "@/app/hooks/useHooks";

const ChatPanel = React.memo(() => {
  //use states
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [chatState, setChatState] = useState<ChatsType[]>([]);

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
    }),
    shallowEqual
  );

  //redux dispatcher
  const dispatch = useDispatch<PusherChatDispatch>();

  //use hooks
  const presence = useOnlinePresence(states.activeChat?.uid ?? "");

  // get Chats ( tanstack )
  const { data, isPending, refetch } = useGetChats(states.authUser?.uid ?? "");
  const msg = useMemo(
    () => states.liveMessagesArray.at(-1),
    [states.liveMessagesArray]
  );

  console.log("live message", states.liveMessagesArray.at(-1));
  //use Effect: add chats to the react state for global access ( initially )
  useEffect(() => {
    if (data?.chats.length === 0) return;
    console.log("🤗");
    if (Array.isArray(data?.chats)) {
      // alert("RUN HERE");
      dispatch(setChats(data.chats));
      setChatState(data?.chats);
    }
  }, [data?.chats, dispatch]);

  //Use Effect: for revalidate the data ( refetch ) when chats change for the new Chats
  //heavy test needed for this -> for now it keep there
  useEffect(() => {
    if (states.chatsArray?.length) {
      setChatState(states.chatsArray);
      const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
      wait(1000);
      refetch();
    }
  }, [states.chatsArray?.length, refetch, states.chatsArray]);

  // Use Effect: stop update ( increase ) unread message if current chat is open
  useEffect(() => {
    if (!msg) return;

    setChatState((prev) =>
      prev.map((chat) => {
        if (
          states.activeChat?.chatId === chat?.chatId &&
          chat.chatId === msg.chatId
        )
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
  }, [states.activeChat?.chatId, msg]);

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
        const isMsgToMe = msg.senderId === states.authUser?.uid;

        const previous =
          chat?.unreadCount?.find((u) => u.userId === states.authUser?.uid)
            ?.count || 0;

        return {
          ...chat,
          lastMessage: msg.content,
          updatedAt: msg.createdAt,
          senderId: msg.senderId,
          status: msg.status,
          unreadCount: isMsgToMe
            ? []
            : states.activeChat?.chatId === chat?.chatId &&
              chat.chatId === msg.chatId
            ? []
            : [{ userId: states.authUser?.uid ?? " ", count: previous + 1 }],
        };
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states.authUser?.uid, msg]);

  //use Effect: clear count
  useEffect(() => {
    if (!states.activeChat?.chatId || !states.authUser?.uid) return;
    console.log("🟢");
    setChatState((prev) =>
      prev.map((chat) => {
        if (chat.chatId !== states.activeChat?.chatId) return chat;

        return {
          ...chat,
          unreadCount: chat.unreadCount?.map((c) =>
            c.userId === states.authUser?.uid ? { ...c, count: 0 } : c
          ),
        };
      })
    );
  }, [states.activeChat?.chatId, states.authUser?.uid]);

  //use Effect: update message seen status ( in this case last messagee status of chat)
  useEffect(() => {
    if (!states.messageSeen.chatId) return;

    setChatState((prev) =>
      prev.map((c) =>
        c.chatId === states.messageSeen?.chatId ? { ...c, status: "seen" } : c
      )
    );
  }, [states.messageSeen.chatId]);

  return (
    <div
      className={`z-50 transition-all bg-[var(--pattern_2)] h-full w-full sm:w-96  overflow-y-auto  custom-scrollbar-y `}
    >
      <BaseModal setOpenModal={setOpenModal} openModal={openModal}>
        <NewChat className="pointer-events-auto" />
      </BaseModal>
      <div>{states.authUser?.createdAt}</div>
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
                  receiverId={c.receiverId}
                  chatId={c.chatId}
                  unreadCount={c.unreadCount}
                  name={c.name}
                  authUserId={states.authUser?.uid}
                  className={
                    states.activeChat?.chatId === c.chatId
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
      {states.currentTab === "users" && <UserDetails />}
    </div>
  );
});

ChatPanel.displayName = "ChatPanel";
export default ChatPanel;
