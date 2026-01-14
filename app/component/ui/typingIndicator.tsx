/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypingUser } from "@/app/types";
import Loading from "./loading";

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
        return <Loading username={UserTyping.userName} />;
      } else if (version === "3") {
        return <Loading username={UserTyping.userName} version={version} />;
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
  }
};
