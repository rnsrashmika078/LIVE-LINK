/* eslint-disable react-hooks/set-state-in-effect */
import {
  ChangeEvent,
  forwardRef,
  ReactNode,
  TextareaHTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { Button } from "./button";
import { IoMdSend } from "react-icons/io";
import { useDebounce } from "@/app/hooks/useHooks";
import { CgAttachment } from "react-icons/cg";
import { BiMicrophone, BiSend } from "react-icons/bi";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  type?: string;
  onClickButton?: (button: string) => void;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ type, onClickButton, ...props }: TextAreaProps, ref) => {
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
            onClick={() => onClickButton?.("emojis")}
          />
          <CgAttachment
            size={size}
            className={iconStyles}
            onClick={() => onClickButton?.("attachment")}
          />
        </div>
        <div className="flex gap-2 absolute bottom-2.5 right-2">
          <BiSend
            size={size}
            className={iconStyles}
            onClick={() => onClickButton?.("send")}
          />
          <BiMicrophone
            size={size}
            className={iconStyles}
            onClick={() => onClickButton?.("voice")}
          />
        </div>
        {/* <Button onClick={onClickButton} variant="eco" radius="full">
          <IoMdSend />
        </Button> */}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
