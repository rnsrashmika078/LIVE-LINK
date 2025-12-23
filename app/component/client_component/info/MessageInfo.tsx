import { Message } from "@/app/types";
import React from "react";
import MessageFormat from "../../ui/format";
import { MessageVsUsers } from "../../ui/cards";

const MessageInfo = ({ msg }: { msg: Message }) => {
  let content = null;
  try {
    if (msg) {
      content = JSON.parse(msg.content);
    }
  } catch (err) {
    console.log(err);
  }
  if (!msg) return null;
  return (
    <div className="flex flex-col">
      <p className=" text-xs text-gray-500 py-1">Message</p>
      <div className="">
        <div className="flex justify-between items-center">
          <MessageFormat
            format={content?.format}
            message={content?.message}
            url={content?.url}
          />
          <p className="text-xs">
            {msg?.createdAt && new Date(msg.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <p className="text-xs text-gray-500 py-1">Seen By</p>
        <ul className="">
          <MessageVsUsers friends={msg.seenBy!} phrase="seen" />
        </ul>
        <p className="text-xs text-gray-500 py-1">Delivered to</p>
        <ul className="">
          <MessageVsUsers friends={msg.seenBy!} phrase="delivered" />
        </ul>
      </div>
    </div>
  );
};

export default MessageInfo;
