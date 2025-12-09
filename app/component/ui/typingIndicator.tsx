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
      <div className="fixed bottom-20">
        {version === "1" && (
          <p className="animate-pulse italic px-2 flex gap-1 items-center">
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
