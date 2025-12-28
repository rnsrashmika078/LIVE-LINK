/* eslint-disable react-hooks/set-state-in-effect */
import {
  ChangeEvent,
  forwardRef,
  TextareaHTMLAttributes,
  useCallback,
  useState,
} from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { CgAttachment } from "react-icons/cg";
import { BiMicrophone, BiSend } from "react-icons/bi";

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
    const [row, setRow] = useState<number>(1);
    const size = 20;
    const iconStyles = `hover:text-green-400 transition-all hover:scale-120 cursor-pointer`;
    const rows = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
      const length = e.target.value.length;

      setRow((prev) => {
        if (length > 50) {
          if (prev >= 10) return prev;
          return prev + 2;
        } else {
          return 1;
        }
      });
    }, []);

    return (
      <div className="flex relative w-full">
        <>
          {/* {selection !== "voice" || !selection ? ( */}
          {/* <> */}
          <textarea
            ref={ref}
            {...props}
            rows={row}
            onInput={rows}
            className="outline-none focus-ring-0 pl-15 pr-15 w-full border border-[var(--pattern_2)] p-2 rounded-xl custom-scrollbar-y"
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
