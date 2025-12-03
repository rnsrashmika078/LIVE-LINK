"use client";
import Avatar from "@/app/component/ui/avatar";
import { setChats } from "@/app/lib/redux/chatslicer";
import {
  useGetMessages,
  useSaveMessage,
} from "@/app/lib/tanstack/tanstackQuery";
import { Message, PusherChatDispatch, PusherChatState } from "@/app/types";
import React, { use, useEffect, useState } from "react";
import { BiPhoneCall, BiSearch, BiVideo } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";

const MessageArea = () => {
  //use states
  const [messages, setMessages] = useState<Message[]>([]);

  //redux dispatcher
  const dispatch = useDispatch<PusherChatDispatch>();

  //redux states
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );
  const liveMessages = useSelector(
    (store: PusherChatState) => store.chat.messages
  );
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);

  //generate chatId
  const chatId = [authUser?.uid, activeChat?.uid].sort().join("-");

  //get Messages ( tanstack )
  const { data, isPending } = useGetMessages(chatId);

  //save message  ( tanstack )
  const { mutate } = useSaveMessage();
  const request = async (message: string) => {
    mutate({
      content: message,
      senderId: authUser?.uid ?? "",
      receiverId: activeChat?.uid ?? "",
      chatId: chatId,
    });
  };

  //use Effect: merge lives messages ( pusher ) with current Message
  useEffect(() => {
    const addLiveMessage = async () => {
      if (!liveMessages) return;
      setMessages((prev) => [...prev, liveMessages]);
    };
    addLiveMessage();
  }, [authUser?.uid, liveMessages]);

  //use Effect: add messages that fetch from backend to the messages state ( initially )
  useEffect(() => {
    const AsyncMessages = async () => {
      if (data && data?.history) {
        setMessages(data?.history);
      }
    };
    AsyncMessages();
  }, [data]);
  const joined = useSelector(
    (store: PusherChatState) => store.friends.joinedUsers
  );
  const left = useSelector((store: PusherChatState) => store.friends.leftUsers);
  const onlineUsers = useSelector(
    (store: PusherChatState) => store.friends.OnlineUsers
  );

  // console.log("joined", joined?.email);
  // console.log("onlineUsers", onlineUsers);
  useEffect(() => {
    console.log("onlineUsers", onlineUsers);
  }, [onlineUsers, onlineUsers.length]);

  const [presenceStatus, setPresenceStatus] = useState<string>("offline");

  const presence = onlineUsers.some((u) => u.uid === activeChat?.uid);

  return (
    <div className="flex flex-col w-full overflow-x-auto h-full ">
      {activeChat && (
        <>
          <div className="flex p-5 justify-between w-full bg-[var(--pattern_3)] items-center  sticky top-0">
            <div className="flex items-center gap-3">
              <Avatar image={activeChat?.dp || "/no_avatar2.png"} />
              <div className="w-full">
                <h1 className="">{activeChat?.name}</h1>
                <p className="text-xs text-[var(--pattern_4)]">
                  {presence ? "ONLINE" : "OFFLINE"}
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <BiPhoneCall size={20} />
              <BiVideo size={20} />
              <BiSearch size={20} />
            </div>
          </div>
          <div className="p-5  overflow-y-auto custom-scrollbar-y">
            {messages?.map((msg, index) => {
              if (msg.chatId !== activeChat?.chatId) {
                return;
              }
              return (
                <div
                  key={index}
                  className={`flex w-full mt-2 ${
                    msg.senderId === authUser?.uid
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <p
                    className={`flex w-fit px-3 py-1  ${
                      msg.senderId === authUser?.uid
                        ? "justify-end bg-gradient-to-r rounded-tl-xl from-purple-800  to-purple-400"
                        : "justify-start bg-gradient-to-r rounded-br-xl from-green-800  to-green-700"
                    }`}
                  >
                    {msg.content}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="flex gap-5 mt-auto w-full p-2 place-items-center ">
            <textarea
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (messages.length === 0) {
                    const newChat = [
                      {
                        chatId: chatId,
                        lastMessage: e.currentTarget.value,
                        uid: activeChat?.uid,
                        name: activeChat?.name,
                        email: activeChat?.email,
                        dp: activeChat?.dp,
                      },
                    ];
                    dispatch(setChats(newChat));
                  }
                  request(e.currentTarget.value);
                  e.preventDefault();
                  e.currentTarget.value = "";
                }
              }}
              placeholder="Enter your message"
              className="w-full border p-2 rounded-xl custom-scrollbar-y"
            ></textarea>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageArea;
