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
                        <h1 className="text-">{name || "My Status"}</h1>
                        <p className="text-xs text-[var(--pattern_4)]">
                            {created_at || "No updates"}
                        </p>
                    </div>
                </div>
            )}{" "}
            {version === 3 && (
                <div className="flex items-center gap-3 justify-between w-full">
                    <Avatar image={avatar || "/no_avatar2.png"} />
                    <div className=" flex flex-col justify-between items-start w-full">
                        <h1 className="">{name || "My Status"}</h1>
                        <p className="text-sm text-[var(--pattern_4)] ">
                            {lastMessage ||
                                "Last Message goes here in this card as well as the name"}
                        </p>
                    </div>
                    <div className="">
                        <p className="text-xs text-[var(--pattern_4)]">
                            {created_at?.toString().split(":")[0] +
                                ":" +
                                created_at?.toString().split(":")[1] ||
                                "No updates"}
                        </p>
                        {unreadCount && unreadCount > 0 && (
                            <span className="w-16 h-16 rounded-full text-xs text-[var(--pattern_3)] font-bold px-2 py-1 bg-green-500">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                </div>
            )}
            {version === 2 && (
                <Button variant="dark">
                    <BiPlus />
                </Button>
            )}
        </div>
    );
};
