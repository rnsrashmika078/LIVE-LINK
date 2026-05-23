import React from "react";
import { BiEdit } from "react-icons/bi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";

interface TopBarProps {
  callback?: (text: string) => void;
  title?: string;
  subTitle?: string;
  route: string;
  type?: "first" | "main" | "back";
}
const TopBar = ({ title, type, subTitle, callback, route }: TopBarProps) => {
  return (
    <div className="flex flex-col gap-2  justify-start items-center w-full sticky z-[99] top-0 bg-[var(--pattern_2)] p-2">
      <div className="flex justify-between items-start w-full">
        <div className=" w-full">
          <strong>{title}</strong>
          <p className="sub-styles w-full">{subTitle}</p>
        </div>
        {type === "back" && (
          <IoIosArrowRoundBack
            size={30}
            onClick={() => callback?.(route)}
            className="p-1 hover:bg-[var(--pattern_5)] rounded-md"
          />
        )}
      
        {type === "first" && (
          <BiEdit
            size={30}
            onClick={() => callback?.("edit")}
            className="p-1 hover:bg-[var(--pattern_5)] rounded-md"
          />
        )}
      </div>
    </div>
  );
};

export default TopBar;
