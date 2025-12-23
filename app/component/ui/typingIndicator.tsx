/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypingUser } from "@/app/types";
import { TiMessageTyping } from "react-icons/ti";

type TypingIndicatorProps = {
  UserTyping: TypingUser | TypingUser[];
  version: "1" | "2" | "3";
};
export const TypingIndicator = ({
  UserTyping,
  version = "1",
}: TypingIndicatorProps) => {
  if (!Array.isArray(UserTyping)) {
    /** if not array of objects */
    if (UserTyping?.isTyping) {
      /** user is typing */
      if (version === "1") {
        return (
          <p className="fixed bottom-16 animate-pulse italic p-2 flex gap-1 items-center bg-[var(--pattern_3)]  rounded-2xl">
            <TiMessageTyping size={30} color="green" />
            {UserTyping?.userName?.split(" ")[0] + " is typing..."}
          </p>
        );
      } else if (version === "2") {
        return (
          <p className="flex font-bold  text-xs text-green-400 animate-pulse">
            {UserTyping.type === "Group"
              ? UserTyping?.userName + " Typing..."
              : "Typing..."}
          </p>
        );
      }
    }
    // single object
  }
};
