import React, { HTMLAttributes, ReactNode, useCallback, useRef } from "react";
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
}
export const MessageUI = React.memo(
  ({ msg, children, authUser, ...props }: MessageUIProps) => {
    const focusRef = useRef<HTMLDivElement | null>(null);
    const { id, setId } = useLiveLink();
    const area = useClickFocus(focusRef);
    const { handleOperation, result } = useActionMenuOperation();

    const actionMenuHandler = (value: string) => {
      handleOperation(value, msg.customId, msg.chatId, public_id);
    };
    if (!msg) return null;

    let parsed;
    try {
      parsed = JSON.parse(msg.content);
    } catch {
      return <p className="text-red-500">Invalid message</p>;
    }

    const { format, url, message, public_id } = parsed;

    // ---- main return statement ----

    // your Redux store

    return (
      <div
        className={`flex w-full mt-2   ${
          msg.senderId === authUser?.uid ||
          msg.senderInfo?.senderId === authUser.uid
            ? "justify-end"
            : "justify-start"
        }`}
      >
        <div
          ref={focusRef}
          {...props}
          className={`flex text-xs flex-col w-fit relative   ${
            msg.senderId === authUser?.uid ||
            msg.senderInfo?.senderId === authUser.uid
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
            senderInfo={msg.senderInfo} // use only in group chats
          />
          {area !== "OutSide" && (
            <Menu
              id={id}
              setId={setId}
              msg={msg}
              onSelect={actionMenuHandler}
              condition={authUser.uid === msg.senderId}
            >
              {actionMenuItem.map((item) => (
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
            {OnMessageSeen(msg.senderId === authUser?.uid, msg.status!)}
          </div>
        </div>
      </div>
    );
  }
);

MessageUI.displayName = "MessageUI";
