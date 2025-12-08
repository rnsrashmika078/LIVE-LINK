import Avatar from "./avatar";
import { Button } from "./button";
import { messageStatus } from "@/app/util/data";
import { PusherChatState, Unread } from "@/app/types";
import React, { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { IoCheckmarkDone } from "react-icons/io5";
import { modifiedMessage } from "@/app/util/helper";

interface UserCardProps {
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  version?: number;
  lastMessage?: string;
  unreadCount?: Unread[];
  senderId?: string;
  receiverId?: string;
  chatId?: string;
  authUserId?: string;
  email?: string;
  status?: "sent" | "delivered" | "seen";
  className?: string;
  useFor?: "my-req" | "friend-req" | "chat-list" | "send-req" | "chat";
  handleClick?: () => void;
}
export const UserCard = React.memo(
  ({
    avatar,
    name,
    createdAt,
    updatedAt,
    lastMessage,
    authUserId,
    unreadCount,
    receiverId,
    chatId,
    senderId,
    className,
    status = "sent",
    email,
    useFor = "my-req",
    handleClick,
    version = 2,
  }: UserCardProps) => {
    const dynamicClass = `flex gap-3 rounded-xl  w-full ${
      version == 2 ? "justify-between" : "justify-start"
    } items-center hover:bg-[var(--pattern_5)]">
`;

    const buttonText = {
      "my-req": "Request Sent",
      "friend-req": "Accept",
      "chat-list": "Open Chat",
      "send-req": "Send Request",
      chat: "Chat",
    };

    const Icon = messageStatus[status];
    const states = useSelector(
      (store: PusherChatState) => ({
        authUser: store.chat.authUser,
        activeChat: store.chat.activeChat,
        typingUsers: store.chat.typingUsers,
      }),
      shallowEqual
    );

    const isUserTyping = useMemo(
      () =>
        states.typingUsers.some(
          (u) =>
            u.chatId === chatId &&
            (u.userId === receiverId || u.userId === senderId) &&
            u.isTyping
        ),
      [chatId, receiverId, senderId, states.typingUsers]
    );

    //grab unread count
    const unreads = unreadCount?.find(
      (u) => u.userId === authUserId && u.count > 0
    );

    return (
      <div
        className={`${dynamicClass} hover:bg-[var(--pattern_5)] mt-1 ${className}  transition-all`}
      >
        {version === 1 && (
          <div className="flex items-center gap-3">
            <Avatar image={avatar || "/no_avatar2.png"} />
            <div className="">
              <h1 className="text-">{name || "My Status"}</h1>
              <p className="text-xs text-[var(--pattern_4)]">{createdAt}</p>
            </div>
          </div>
        )}
        {version === 2 && (
          <div className="px-2 py-1 rounded-xl flex items-center gap-2 shadow-xl border border-[var(--pattern_5)] w-full">
            <Avatar image={avatar || "/no_avatar2.png"} />
            <div className="">
              <h1 className="text-sm">{name || "My Status"}</h1>

              <Button
                variant="dark"
                size="xs"
                className="gap-2"
                onClick={handleClick}
              >
                {buttonText[useFor]}
              </Button>
            </div>
          </div>
        )}
        {version === 10 && (
          <div className="flex items-center gap-3">
            <Avatar image={avatar || "/no_avatar2.png"} />
            <div className="">
              <h1 className="text-">{name || "My Status"}</h1>
              <p className="text-xs text-[var(--pattern_4)]">{email}</p>
            </div>
          </div>
        )}
        {version === 3 && (
          <div
            className="w-full flex items-center gap-2 p-2"
            onClick={handleClick}
          >
            <Avatar image={avatar || "/no_avatar2.png"} />
            <div className="flex flex-col w-full  items-center space-y-1 min-w-5">
              <div className="flex justify-between w-full  items-center">
                <h1 className="w-60 sm:w-50 truncate font-bold flex-shrink ">
                  {name}
                </h1>
                <p className="text-xs">
                  {" "}
                  {updatedAt
                    ? new Date(updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </p>
              </div>
              <div className="flex justify-between w-full items-center ">
                <div className="flex  min-w-0 ">
                  <p className="flex w-72 text-[var(--pattern_4)] sm:w-56 truncate flex-shrink items-center text-xs">
                    {isUserTyping ? (
                      <span className="flex font-bold  text-xs text-green-400 animate-pulse">
                        {"Typing..."}
                      </span>
                    ) : (
                      modifiedMessage(lastMessage ?? "")
                    )}
                  </p>
                  {!isUserTyping && (
                    <p className="flex items-center">
                      {senderId === authUserId ? (
                        <Icon
                          color={`${status === "seen" ? "red" : ""}`}
                          size={15}
                          className="inline ml-1 text-white text-xs"
                        />
                      ) : null}
                    </p>
                  )}
                </div>
                {unreads ? (
                  <p className=" font-bold w-5 h-5 flex justify-center bg-green-500 place-items-center rounded-full">
                    {unreads?.count}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

UserCard.displayName = "UserCard";
