import React, {
  HTMLAttributes,
  ReactNode,
  useRef,

} from "react";
import { AuthUser, Message } from "@/app/types";
import { OnMessageSeen } from "@/app/helper/jsxhelper";
import MessageFormat from "./format";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { Menu, MenuItem } from "./action_menu";
import { useActionMenuOperation, useClickFocus } from "@/app/hooks/useHooks";


interface MessageUIProps extends HTMLAttributes<HTMLDivElement> {
  msg: Message;
  authUser: AuthUser;
  children?: ReactNode;
}
export const MessageUI = React.memo(
  ({ msg, children, authUser, ...props }: MessageUIProps) => {
    const focusRef = useRef<HTMLDivElement | null>(null);
    const { id, setId, onSelect, setOnSelect } = useLiveLink();
    const area = useClickFocus(focusRef);
    const { handleOperation, result } = useActionMenuOperation();

    if (!msg) return null;

    let parsed;
    try {
      parsed = JSON.parse(msg.content);
    } catch {
      return <p className="text-red-500">Invalid message</p>;
    }

    const { format, url, message, public_id } = parsed;

    // ---- main return statement ----

    function actionMenuHandler(value: string) {
      handleOperation(value, msg.customId, msg.chatId, public_id);
      // alert(value);
    }
    // your Redux store

    return (
      <div
        className={`flex w-full mt-2   ${
          msg.senderId === authUser?.uid ? "justify-end" : "justify-start"
        }`}
      >
        <div
          ref={focusRef}
          {...props}
          className={`pr-5 flex flex-col w-fit relative   ${
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
          {children}
          <MessageFormat
            info={result.message}
            id={msg.customId ?? ""}
            format={format}
            url={url}
            message={message}
          />
          {area !== "OutSide" && (
            <Menu
              id={id}
              setId={setId}
              msg={msg}
              onSelect={actionMenuHandler}
              condition={authUser.uid === msg.senderId}
            >
              <MenuItem value="Reply" />
              <MenuItem value="Copy" />
              <MenuItem value="Forward" />
              <MenuItem value="Delete" />
              <MenuItem value="Report" />
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
