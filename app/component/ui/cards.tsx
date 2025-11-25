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
}
export const UserCard = ({
  avatar,
  name,
  created_at,
  lastMessage,
  unreadCount,
  version = 2,
}: UserCardProps) => {
  const dynamicClass = `flex gap-3 rounded-xl px-2 py-2 w-full ${
    version == 2 ? "justify-between" : "justify-start"
  } items-center hover:bg-[var(--pattern_5)]">
`;
  return (
    <div className={`${dynamicClass} hover:bg-[var(--pattern_5)]`}>
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
        <div className="flex items-center gap-3">
          <Avatar image={avatar || "/no_avatar2.png"} />
          <div className="">
            <h1 className="text-sm">{name || "My Status"}</h1>
            <Button variant="dark" size="xs" className="gap-2">
              <BiPlus /> Add Friend
            </Button>
          </div>
        </div>
      )}{" "}
      {version === 3 && (
        <div className="flex justify-between w-full items-start gap-2">
          <div className="max-w-720% flex shrink-0 items-center gap-3">
            <Avatar image={avatar || "/no_avatar2.png"} />
            <div className="flex flex-col w-full">
              <h1 className="font-bold w-42 sm:w-56 truncate ">{name}</h1>
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
          </div>
        </div>
      )}
    </div>
  );
};
