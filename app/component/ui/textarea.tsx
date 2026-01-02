import {
  ChangeEvent,
  TextareaHTMLAttributes,
  useCallback,
  useRef,
  useState,
} from "react";
import { MdOutlineEmojiEmotions, MdOutlineSchedule } from "react-icons/md";
import { CgAttachment } from "react-icons/cg";
import { BiMicrophone, BiSend } from "react-icons/bi";
import { useLiveLink } from "@/app/context/LiveLinkContext";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  type?: string;
  preview?: string;
  visible?: boolean;
  support?: "only-message" | "message-voice";
  onClickButton?: (button: string) => void;
};

export const TextArea = ({
  onClickButton,
  support = "message-voice",
  preview,
  visible = true,
  ...props
}: TextAreaProps) => {
  const [selection, setSelection] = useState<string | null>(null);
  const { scheduleActivate, setScheduleActivate } = useLiveLink();
  const size = 20;
  const iconStyles = `hover:text-green-400 transition-all hover:scale-120 cursor-pointer`;
  const [searchText, setSearchText] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const handleSearch = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSearchText(val);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;

      const maxHeight = 200;

      textareaRef.current.style.height =
        Math.min(scrollHeight, maxHeight) + "px";

      textareaRef.current.style.overflowY =
        scrollHeight > maxHeight ? "auto" : "hidden";
    }
  };

  return (
    <div className="flex relative w-full">
      <>
        <textarea
          ref={textareaRef}
          {...props}
          rows={1}
          value={props.value}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchText("");
              props.onKeyDown?.(e);
            }
          }}
          onChange={(e) => {
            props.onChange?.(e);
            handleSearch(e);
          }}
          className={`resize-none  outline-none focus-ring-0 ${
            visible ? "pl-24" : "pl-16"
          } pr-15 w-full border border-[var(--pattern_2)] p-2 rounded-xl custom-scrollbar-y`}
        />
        <div className="flex gap-2 absolute bottom-2.5 left-2">
          <MdOutlineEmojiEmotions
            size={size}
            className={iconStyles}
            onClick={() => {
              setSelection("emojis");
              onClickButton?.("emojis");
            }}
          />
          <CgAttachment
            size={size}
            className={iconStyles}
            onClick={() => {
              setSelection("attachment");
              onClickButton?.("attachment");
            }}
          />
          {visible && (
            <MdOutlineSchedule
              size={size}
              className={`${iconStyles} ${
                scheduleActivate ? "text-red-500 animate-pulse" : " "
              }`}
              onClick={() => {
                setScheduleActivate((prev) => !prev);
                // setSelection(activate ? "schedule" : "");
                // onClickButton?.(activate ? "schedule" : "");
              }}
            />
          )}
        </div>
      </>
      <div className="flex gap-2 absolute bottom-2.5 right-2">
        {support !== "only-message" && !searchText && !preview ? (
          <BiMicrophone
            size={size}
            className={iconStyles}
            onClick={() => {
              setSelection("voice");
              onClickButton?.("voice");
            }}
          />
        ) : (
          <BiSend
            size={size}
            className={iconStyles}
            onClick={() => {
              setSelection("send");
              onClickButton?.("send");
              setSearchText("");
            }}
          />
        )}
      </div>
    </div>
  );
};
TextArea.displayName = "TextArea";
