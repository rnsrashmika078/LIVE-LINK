/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message, ParticipantsType } from "@/app/types";
import React from "react";
import MessageFormat from "../../ui/format";
import { MessageVsUsers } from "../../ui/cards";

const ChatInfo = ({
  msg,
  participants,
}: {
  msg: Message;
  participants?: ParticipantsType[];
}) => {
  if (!msg || !participants) return;

  return (
    <div className="flex flex-col">
      <p className=" text-xs text-gray-500 py-1">CHAT INFO</p>
      <div className="">
        <div className="flex justify-between items-center">
          <MessageFormat
            format={msg.content?.format}
            message={msg.content?.message}
            url={msg.content?.url}
          />
          <p className="text-xs">
            {msg?.createdAt && new Date(msg.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <p className="text-xs text-gray-500 py-1">Group Members</p>
        <ul className="">
          <MessageVsUsers participants={participants} phrase="seen" />
        </ul>
      </div>
    </div>
  );
};

export default ChatInfo;
