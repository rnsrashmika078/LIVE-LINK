import { TiMessageTyping } from "react-icons/ti";

type TypingIndicatorProps = {
  isUserTyping: boolean;
  username?: string;
  version: "1" | "2";
};
export const TypingIndicator = ({
  isUserTyping,
  username,
  version = "1",
}: TypingIndicatorProps) => {
  if (isUserTyping) {
    return (
      <div className="">
        {version === "1" && (
          <p className="fixed bottom-15 animate-pulse italic p-2 flex gap-1 items-center bg-[var(--pattern_3)]  rounded-2xl">
            <TiMessageTyping size={30} color="green" />
            {username?.split(" ")[0] + " is typing..."}
          </p>
        )}
        {version === "2" && (
          <p className="flex font-bold  text-xs text-green-400 animate-pulse">
            {"Typing..."}
          </p>
        )}
      </div>
    );
  }
  return null;
};
