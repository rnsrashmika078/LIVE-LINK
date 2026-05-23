/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoCheckmark } from "react-icons/io5";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import React, { useEffect, useState } from "react";
import {
  TbRelationManyToMany,
  TbRelationManyToManyFilled,
} from "react-icons/tb";
import { TypingIndicator } from "../component/ui/typingIndicator";
import { modifiedMessage } from "./helper";
import { Message, MessageContentType, TypingUser } from "../types";

export function OnMessageSeen(
  condition: boolean,
  status: string,
  type?: string
) {
  if (condition) {
    return (
      <>
        {type?.toLowerCase().includes("individual") && (
          <div>
            {status === "seen" && <IoMdEye color="lightgreen" />}
            {status === "delivered" && <IoMdEyeOff />}
            {status === "sent" && <IoCheckmark />}
          </div>
        )}
        {type?.toLowerCase().includes("group") && (
          <div>
            {status === "seen" && (
              <TbRelationManyToManyFilled color="lightgreen" size={15} />
            )}
            {status === "delivered" && <TbRelationManyToMany size={15} />}
            {status === "sent" && <IoCheckmark size={15} />}
          </div>
        )}
      </>
    );
  }
  return <div>{null}</div>;
}

export function formattedDate(createdAt: string) {
  const now = new Date(createdAt);
  const date = new Date();

  const difference = (now.getTime() - date.getTime()) / 1000;

  const days = Math.floor(difference / 86400);

  return days;
}
type Props = {
  name: string;
};

export const SenderNameStyle = React.memo(({ name }: Props) => {
  const letter = name.slice(0, 1)[0];

  const [style, setStyle] = useState<string>("text-white");
  useEffect(() => {
    switch (letter.toLowerCase()) {
      case "r":
        setStyle("text-red-500");
        break;
      case "a":
        setStyle("text-white-500");
        break;
      case "b":
        setStyle("text-orange-500");
        break;
      case "c":
        setStyle("text-purple-500");
        break;
      default:
        setStyle("text-green-500");
    }
  }, [letter, name]);

  return <p className={style}>{name}</p>;
});

SenderNameStyle.displayName = "SenderNameStyle";

interface CardHeaderProps {
  name: string;
  updatedAt?: string | undefined;
  isUserTyping?: any | undefined;
  lastMessage?: any | undefined;
  senderId?: string | undefined;
  userId?: string | undefined;
  unreads?: any | undefined;
  unreadCount?: number | undefined;
  status?: string | undefined;
}
export const CardHeader = ({ props }: { props: CardHeaderProps }) => {
  return (
    <div className="flex flex-col w-full  items-center space-y-1 min-w-5">
      <div className="bg-blue-500 flex justify-between w-full  items-center">
        <h1 className="w-56 bg-yellow-500 truncate text-sm font-bold  ">
          {props.name}
        </h1>
        <p className="text-xs w-16">
          {props.updatedAt
            ? new Date(props.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </p>
      </div>
      <div className="flex justify-between w-full items-center bg-red-500">
        <div className="flex  min-w-0 ">
          <div className="flex w-72 text-[var(--pattern_4)] truncate flex-shrink items-center text-xs">
            {props.isUserTyping ? (
              <TypingIndicator
                UserTyping={props.isUserTyping as TypingUser}
                version="2"
              />
            ) : (
              <>
                {props.lastMessage.message && (
                  <p>
                    <strong className="">
                      {props.lastMessage?.name?.split(" ")[0]}:{" "}
                    </strong>
                    {/* {modifiedMessage(props.lastMessage.message)} */}
                  </p>
                )}
                {modifiedMessage(
                  props.lastMessage ?? props.lastMessage?.message
                )}
              </>
            )}
          </div>
          {!props.isUserTyping &&
            OnMessageSeen(
              props.senderId === props.userId,
              props.status as string,
              "Individual"
            )}
        </div>
        {props.unreads !== undefined ? (
          <div className=" font-bold w-5 h-5 flex justify-center bg-green-500 place-items-center rounded-full">
            {props.unreads?.count}
          </div>
        ) : null}

        {props.unreadCount !== undefined && props.unreadCount !== 0 ? (
          <div className=" font-bold w-5 h-5 flex justify-center bg-green-500 place-items-center rounded-full">
            {props.unreadCount}
          </div>
        ) : null}
      </div>
    </div>
  );
};
