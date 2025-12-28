/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Avatar from "./avatar";
import { Button } from "./button";
import {
  AuthUser,
  ChatsType,
  GroupType,
  ParticipantsType,
  PusherChatState,
  SeenByType,
  SeenByUserType,
  StatusType,
  TypingUser,
  Unread,
} from "@/app/types";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { modifiedMessage } from "@/app/helper/helper";
import { OnMessageSeen } from "@/app/helper/jsxhelper";
import { TypingIndicator } from "./typingIndicator";
import { CgClose } from "react-icons/cg";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import Select, { SelectItem } from "./select";

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
  lastSeen?: any;
  presence?: any;
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
    presence,
    lastSeen,
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
        {version == 4 && (
          <div className="flex items-center gap-3">
            <Avatar image={states.activeChat?.dp || "/no_avatar2.png"} />
            <div className="w-full">
              <h1 className="">{states.activeChat?.name}</h1>
              <p className="text-xs text-[var(--pattern_4)]">
                {presence !== "Online"
                  ? lastSeen
                    ? "Last Seen: " + new Date(lastSeen).toLocaleTimeString()
                    : null
                  : presence}
              </p>
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
                  <div className="flex w-72 text-[var(--pattern_4)] sm:w-56 truncate flex-shrink items-center text-xs">
                    {isUserTyping ? (
                      <TypingIndicator
                        isUserTyping={isUserTyping}
                        version="2"
                      />
                    ) : (
                      modifiedMessage(lastMessage ?? "")
                    )}
                  </div>
                  {!isUserTyping &&
                    OnMessageSeen(senderId === authUserId, status)}
                </div>
                {unreads ? (
                  <div className=" font-bold w-5 h-5 flex justify-center bg-green-500 place-items-center rounded-full">
                    {unreads?.count}
                  </div>
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

interface UCDInterface {
  chat: ChatsType;
  handleClick?: () => void;
}
export const UserChatCard = ({
  chat: {
    name,
    dp,
    updatedAt,
    unreadCount,
    chatId,
    senderId,
    lastMessage,
    status,
  },
  handleClick,
}: UCDInterface) => {
  const { authUser, typingUsers } = useSelector(
    (store: PusherChatState) => ({
      authUser: store.chat.authUser,
      typingUsers: store.chat.typingUsers,
    }),
    shallowEqual
  );

  const isUserTyping = useMemo(
    () =>
      typingUsers.find((u) =>
        u.chatId === chatId && u.type === "Individual" && u.isTyping ? u : null
      ),
    [chatId, typingUsers]
  );

  //grab unread count
  const unreads = unreadCount?.find(
    (u) => u.userId === authUser?.uid && u.count > 0
  );

  return (
    <div className={` hover:bg-[var(--pattern_5)] mt-1 transition-all`}>
      <div
        className="w-full flex items-center gap-2 p-2"
        onClick={handleClick && handleClick}
      >
        <Avatar image={dp || "/no_avatar2.png"} />
        <div className="flex flex-col w-full  items-center space-y-1 min-w-5">
          <div className="flex justify-between w-full  items-center">
            <h1 className="w-60 sm:w-50 truncate font-bold flex-shrink ">
              {name}
            </h1>
            <p className="text-xs">
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
              <div className="flex w-72 text-[var(--pattern_4)] sm:w-56 truncate flex-shrink items-center text-xs">
                {isUserTyping ? (
                  <TypingIndicator
                    UserTyping={isUserTyping as TypingUser}
                    version="2"
                  />
                ) : (
                  modifiedMessage(lastMessage ?? "")
                )}
              </div>
              {!isUserTyping &&
                OnMessageSeen(
                  senderId === authUser?.uid,
                  status as string,
                  "Individual"
                )}
            </div>
            {unreads ? (
              <div className=" font-bold w-5 h-5 flex justify-center bg-green-500 place-items-center rounded-full">
                {unreads?.count}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
interface UGDInterface {
  group: GroupType;
  test?: string;
  handleClick?: () => void;
}
export const UserGroupCard = ({
  group: { groupName, dp, updatedAt, unreads, chatId, lastMessage },
  handleClick,
}: UGDInterface) => {
  const { authUser, typingUsers } = useSelector(
    (store: PusherChatState) => ({
      authUser: store.chat.authUser,
      typingUsers: store.chat.typingUsers,
    }),
    shallowEqual
  );

  const isUserTyping = useMemo(
    () =>
      typingUsers.find(
        (u) => u.chatId === chatId && u.type === "Group" && u.isTyping
      ),
    [chatId, typingUsers]
  );

  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const unreadCountMatch = unreads?.find((u) => {
      return u.userId === authUser?.uid ? u.count : 0;
    });
    setUnreadCount(unreadCountMatch?.count ?? 0);
  }, [authUser?.uid, unreads]);

  return (
    <div className={` hover:bg-[var(--pattern_5)] mt-1 transition-all`}>
      <div
        className="w-full flex items-center gap-2 p-2"
        onClick={handleClick && handleClick}
      >
        <Avatar image={dp || "/no_avatar2.png"} />
        <div className="flex flex-col w-full  items-center space-y-1 min-w-5">
          <div className="flex justify-between w-full  items-center">
            <h1 className="w-60 sm:w-50 truncate font-bold flex-shrink ">
              {groupName}
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
              <div className="flex w-72 text-[var(--pattern_4)] sm:w-56 truncate flex-shrink items-center text-xs">
                {isUserTyping ? (
                  <TypingIndicator UserTyping={isUserTyping} version="2" />
                ) : (
                  <p>
                    <strong className="">
                      {lastMessage?.name?.split(" ")[0]}:{" "}
                    </strong>
                    {modifiedMessage(lastMessage.message)}
                  </p>
                )}
              </div>
              {/* {!isUserTyping &&
                OnMessageSeen(senderId === authUser?.uid, status as string)} */}
            </div>
            {unreadCount !== 0 ? (
              <div className=" font-bold w-5 h-5 flex justify-center bg-green-500 place-items-center rounded-full">
                {unreadCount}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

interface UserProps {
  friends: AuthUser[];
  handleClick: (user: AuthUser) => void;
}
export const Users = ({ friends, handleClick }: UserProps) => {
  return (
    <>
      {friends.map((f: AuthUser, i: number) => (
        <div
          key={i}
          onClick={() => handleClick(f)}
          className="hover:scale-110 hover:bg-gray-800 cursor-pointer transition-all p-2 rounded-xl flex items-center gap-2 shadow-xl border-b-2 border-b-red-500 w-full"
        >
          <Avatar image={f.dp || "/no_avatar2.png"} />
          <div className="">
            <h1 className="text-sm">{f.name || "name unavailable"}</h1>
          </div>
        </div>
      ))}
    </>
  );
};
interface OtherType {
  friends?: SeenByType[];
  participants?: ParticipantsType[];
  phrase: string;
}
export const MessageVsUsers = ({
  participants,
  friends,
  phrase,
}: OtherType) => {
  const uid = useSelector((store: PusherChatState) => store.chat.authUser?.uid);
  return (
    <>
      {friends
        ? friends
            ?.filter(
              (u) =>
                u.status?.toLowerCase().includes(phrase) && u.userId !== uid
            )
            .map((f: SeenByType, i: number) => (
              <div
                key={i}
                className="mt-2 mb-3 bg-gray-900  cursor-pointer transition-all p-2 rounded-xl flex items-center gap-2 shadow-xl border-b-2  w-full"
              >
                <Avatar
                  height={8}
                  width={8}
                  image={f.userDp || "/no_avatar2.png"}
                />
                <div className="">
                  <h1 className="text-sm">
                    {f.userName || "name unavailable"}
                  </h1>
                </div>
              </div>
            ))
        : participants?.map((f: ParticipantsType, i: number) => (
            <div
              key={i}
              className="mt-2 mb-3 bg-gray-900  cursor-pointer transition-all p-2 rounded-xl flex items-center gap-2 shadow-xl border-b-2  w-full"
            >
              <Avatar
                height={8}
                width={8}
                image={f.userDp || "/no_avatar2.png"}
              />
              <div className="">
                <h1 className="text-sm">
                  {f.userId === uid ? "You" : f.userName}
                  <p>{f.userId}</p>
                </h1>
              </div>
            </div>
          ))}
    </>
  );
};
export const AddUser = ({ friends, handleClick }: UserProps) => {
  return (
    <>
      {friends.map((f: any, i: number) => (
        <div
          key={i}
          className="p-1 relative rounded-xl flex items-center gap-2 shadow-xl border-2 border-[var(--pattern_5)] w-full "
        >
          <Avatar image={f.dp || "/no_avatar2.png"} height={8} width={8} />
          <div className="">
            <h1 className="text-xs">
              {f.name.split(" ")[0] || "name unavailable"}
            </h1>
          </div>
          <div className="bg-black rounded-2xl p-1 absolute right-2 cursor-pointer hover:scale-120 transition-all">
            <CgClose onClick={() => handleClick(f)} />
          </div>
        </div>
      ))}
    </>
  );
};

interface StatusCardProps {
  users: StatusType[];
  handleClick: (user: StatusType) => void;
  children?: ReactNode;
  authId?: string;
  type?: "MY" | "OTHERS";
}
export const StatusCard = ({
  type = "MY",
  authId,
  users,
  handleClick,
  children,
}: StatusCardProps) => {
  return (
    <>
      {type === "OTHERS" &&
        users?.map((u: StatusType, i: number) => {
          const IsSeenBefore = u?.seenBy?.some((u) =>
            u.uid === authId ? u.statusId : null
          );
          return (
            <div
              key={i}
              onClick={(e) => {
                // e.stopPropagation();
                handleClick(u);
              }}
              className="relative hover:bg-gray-800 cursor-pointer transition-all p-2 rounded-xl flex items-center gap-2 w-full"
            >
              <Avatar
                image={u.dp || "/no_avatar2.png"}
                border={
                  IsSeenBefore
                    ? ""
                    : "border-3 border-green-600  border-gray-200"
                }
              />
              <div className="">
                <h1 className="text-sm">{u.name || "name unavailable"}</h1>
                <p className="sub-styles">
                  {new Date(u.createdAt ?? "").toLocaleTimeString()}
                </p>
                {children}
              </div>
            </div>
          );
        })}

      {type === "MY" && (
        <div
          onClick={(e) => {
            // e.stopPropagation();
            handleClick(users[0]);
          }}
          className=" relative hover:bg-gray-800 cursor-pointer transition-all p-2 rounded-xl flex items-center gap-2 w-full"
        >
          <Avatar image={users[0]?.dp || "/add.png"} />
          <div className="">
            <h1 className="text-md">{users[0]?.name || "My Status"}</h1>
            <p className="text-xs text-gray-400">
              {users[0]?.createdAt
                ? new Date(users[0]?.createdAt ?? "").toLocaleTimeString()
                : "Tap to add status update"}
            </p>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

interface ViewerCard {
  viewers: SeenByUserType;
}
export const Viewer = ({ viewers }: ViewerCard) => {
  return (
    <>
      <div
        onClick={(e) => {}}
        className=" relative hover:bg-gray-800 cursor-pointer transition-all p-2 rounded-xl flex items-center gap-2 w-full"
      >
        <Avatar image={viewers?.dp} />
        <div className="">
          <h1 className="text-md">{viewers?.name}</h1>
          <p className="text-xs text-gray-400">
            {viewers?.createdAt
              ? new Date(viewers?.createdAt ?? "").toLocaleTimeString()
              : "Tap to add status update"}
          </p>
        </div>
      </div>
    </>
  );
};
