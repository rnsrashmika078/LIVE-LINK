import React, { HTMLAttributes, ReactNode, useState } from "react";
import { AuthUser, ClickedMessageType, Message } from "@/app/types";
import { OnMessageSeen } from "@/app/helper/jsxhelper";
import { MdArrowDropDown } from "react-icons/md";
import MessageFormat from "./format";
import { DropDown, MenuItem } from "./dropdown";

interface MessageUIProps extends HTMLAttributes<HTMLDivElement> {
  msg: Message;
  selectId: string;
  authUser: AuthUser;
  children?: ReactNode;
}
export const MessageUI = React.memo(
  ({ msg, selectId, children, authUser, ...props }: MessageUIProps) => {
    if (!msg) return null;

    let parsed;
    try {
      parsed = JSON.parse(msg.content);
    } catch {
      return <p className="text-red-500">Invalid message</p>;
    }

    const { format, url, message } = parsed;

    // ---- FILE MESSAGES ----

    // ---- main return statement ----
    return (
      <div
        className={`flex w-full mt-2   ${
          msg.senderId === authUser?.uid ? "justify-end" : "justify-start"
        }`}
      >
        <div
          {...props}
          className={` flex flex-col w-fit relative ${
            msg.senderId === authUser?.uid
              ? `${
                  url
                    ? "bg-transparent space-y-2"
                    : " bg-[var(--pattern_7)] px-3 py-1"
                } justify-end  rounded-bl-2xl`
              : `${
                  url
                    ? "bg-transparent space-y-2"
                    : " bg-[var(--pattern_3)] px-3 py-1"
                } justify-start  rounded-br-2xl`
          }`}
        >
          <div
            className={` w-full    ${
              msg.senderId === authUser?.uid
                ? "top-0  justify-end translate-x-8"
                : "top-0 justify-start translate-x-0"
            }`}
          >
           
          </div>
          {children}
          <MessageFormat
            id={msg._id ?? ""}
            format={format}
            url={url}
            message={message}
          />
          <div className="flex items-end gap-2">
            <p className="text-[10px] text-[var(--pattern_4)]">
              {msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </p>
            {OnMessageSeen(msg.senderId === authUser?.uid, msg.status!)}
          </div>
        </div>
      </div>
    );
  }
);

MessageUI.displayName = "MessageUI";
