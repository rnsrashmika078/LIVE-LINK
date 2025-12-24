import React, { HTMLAttributes, ReactNode, useRef } from "react";
import { AuthUser, Message } from "@/app/types";
import { OnMessageSeen } from "@/app/helper/jsxhelper";
import MessageFormat from "./format";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { Menu, MenuItem } from "./action_menu";
import { useActionMenuOperation, useClickFocus } from "@/app/hooks/useHooks";
import { actionMenuItem } from "@/app/util/data";

interface MessageUIProps extends HTMLAttributes<HTMLDivElement> {
  msg: Message;
  authUser: AuthUser;
  children?: ReactNode;
  type?: string;
}
export const MessageUI = React.memo(
  ({ msg, children, authUser, type, ...props }: MessageUIProps) => {
    const focusRef = useRef<HTMLDivElement | null>(null);
    const { id, setId } = useLiveLink();
    const area = useClickFocus(focusRef);
    const { handleOperation, result } = useActionMenuOperation();

    const actionMenuHandler = (value: string, msg: Message) => {
      handleOperation(value, msg.customId, msg.chatId, public_id, msg);
    };
    if (!msg) return null;

    let parsed;
    try {
      parsed = JSON.parse(msg.content);
    } catch {
      return null;
    }

    const { format, url, message, public_id } = parsed;

    // ---- main return statement ----

    // your Redux store

    const baseCondition =
      msg.senderId === authUser?.uid ||
      msg.senderInfo?.senderId === authUser.uid;
    return (
      <div
        className={`flex w-full mt-2   ${
          baseCondition ? "justify-end" : "justify-start"
        }`}
      >
        <div
          ref={focusRef}
          {...props}
          className={`pr-6 flex text-xs flex-col w-fit relative   ${
            baseCondition
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
          {children}
          <MessageFormat
            info={result.message}
            id={msg.customId ?? ""}
            format={format}
            url={url}
            message={message}
            senderInfo={msg.senderInfo}
            // use only in group chats
          />
          {area !== "OutSide" && (
            <Menu
              id={id}
              setId={setId}
              msg={msg}
              onSelect={(value) => actionMenuHandler(value, msg)}
              condition={authUser?.uid === msg.senderId}
            >
              {actionMenuItem
                .filter(
                  (a) =>
                    msg.senderId === authUser?.uid ||
                    (msg.senderInfo?.senderId === authUser?.uid
                      ? a
                      : !a.toLowerCase().includes("info"))
                )
                .map((item) => (
                  <MenuItem key={item} value={item} />
                ))}
            </Menu>
          )}

          <div className="flex items-end gap-2">
            <p className="text-[10px] text-[var(--pattern_4)]">
              {msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </p>
            {OnMessageSeen(baseCondition, msg.status!, type!)}
          </div>
        </div>
      </div>
    );
  }
);

MessageUI.displayName = "MessageUI";
