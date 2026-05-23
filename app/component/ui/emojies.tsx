import { EmojiList } from "@/app/util/data";
import React from "react";

const Emoji = ({ onClickEmoji }: { onClickEmoji: (e: string) => void }) => {
  return (
    <div className="flex justify-center items-center gap-3 p-5">
      {EmojiList.map((e, i) => (
        <span
          onClick={() => onClickEmoji(e)}
          key={i}
          className="text-4xl  hover:scale-150 cursor-pointer transition-all"
        >
          {e}
        </span>
      ))}
    </div>
  );
};

export default Emoji;
