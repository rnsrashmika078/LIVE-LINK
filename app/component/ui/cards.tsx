import React from "react";
import Avatar from "./avatar";
import { Button } from "../button";
import { BiPlus } from "react-icons/bi";

interface UserCardProps {
  avatar?: string;
  name?: string;
  created_at?: string;
  version?: number;
  lastMessage?: string;
  unreadCount?: number;
  chatId?: string;
  email?: string;
  className?: string;
  useFor?: "my-req" | "friend-req" | "chat-list" | "send-req" | "chat";
  handleClick?: () => void;
}
export const UserCard = React.memo(
  ({
    avatar,
    name,
    created_at,
    lastMessage,
    unreadCount,
    className,
    chatId,
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
    return (
      <div
        className={`${dynamicClass} hover:bg-[var(--pattern_5)] mt-1 ${className}  transition-all`}
      >
        {version === 1 && (
          <div className="flex items-center gap-3">
            <Avatar image={avatar || "/no_avatar2.png"} />
            <div className="">
              <h1 className="text-">{name || "My Status"}</h1>
              <p className="text-xs text-[var(--pattern_4)]">
                {created_at || "No updates"}
              </p>
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
            className="flex justify-between w-full items-start gap-2 p-2"
            onClick={handleClick}
          >
            <div className="max-w-72% flex shrink-0 items-center gap-3">
              <Avatar image={avatar || "/no_avatar2.png"} />
              <div className="flex flex-col w-full">
                <h1 className="font-bold w-42 sm:w-56 truncate">{name}</h1>
                <p className="w-42 sm:w-56 truncate text-[var(--pattern_4)]">
                  {lastMessage ||
                    "last message goes here last message goes here last message goes here"}
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col justify-end items-end">
              <p className="text-sm text-[var(--pattern_4)]">
                {created_at?.toString().split(":")[0] +
                  ":" +
                  created_at?.toString().split(":")[1] || "No updates"}
              </p>
              <p>{unreadCount}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

UserCard.displayName = "UserCard";
