/* eslint-disable react-hooks/set-state-in-effect */
import {
  ChangeEvent,
  forwardRef,
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
  text?: string;
  preview?: string;
  support?: "only-message" | "message-voice";
  onClickButton?: (button: string) => void;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      onClickButton,
      support = "message-voice",
      text,
      preview,
      ...props
    }: TextAreaProps,
    ref
  ) => {
    const [selection, setSelection] = useState<string | null>(null);
    const [activate, setActivate] = useState<boolean>(false);

    const {scheduleActivate,setScheduleActivate} = useLiveLink();
    const [row, setRow] = useState<number>(1);
    const size = 20;
    const iconStyles = `hover:text-green-400 transition-all hover:scale-120 cursor-pointer`;

    const rows = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
      const len = e.target.value.length;

      if (len > 80) {
        setRow((prev) => prev);
        return;
      }

      const calc = Math.max(1, Math.floor(len / 10));
      setRow(calc);
    }, []);

    return (
      <div className="flex relative w-full">
        <>
          <textarea
            ref={ref}
            {...props}
            rows={row}
            onInput={rows}
            className="outline-none focus-ring-0 pl-24 pr-15 w-full border border-[var(--pattern_2)] p-2 rounded-xl custom-scrollbar-y"
          ></textarea>
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
          </div>
        </>
        <div className="flex gap-2 absolute bottom-2.5 right-2">
          {support !== "only-message" && !text && !preview ? (
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
              }}
            />
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
