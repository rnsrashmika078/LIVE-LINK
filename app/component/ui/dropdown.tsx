//create drop down menu

import { AuthUser, Message } from "@/app/types";
import { createContext, ReactNode, useContext, useState } from "react";
import { BsDroplet } from "react-icons/bs";
import { MdArrowDropDown } from "react-icons/md";
//drop down context type
type DropDownContextType = {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  selection: string;
  setSelection: (value: string) => void;
};

interface DropDownProps {
  children: ReactNode;
  message?: Message;
  authUser?: AuthUser;
  onSelect?: (value: string) => void;
}
//create context
export const DropDownContext = createContext<DropDownContextType | null>(null);

//create use hook

export const useDropDown = () => {
  const context = useContext(DropDownContext);
  if (!context) {
    throw new Error("context must be use withing the Drop Down component");
  }
  return context;
};
//create parent component

export const DropDown = ({
  children,
  onSelect,
  authUser,
  message,
}: DropDownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selection, setSelection] = useState<string>("");
  const handleSelection = (value: string) => {
    setSelection(value);
    if (onSelect) onSelect(value);
  };
  return (
    <DropDownContext.Provider
      value={{ isOpen, setIsOpen, selection, setSelection: handleSelection }} //overriding
    >
      <div onClick={() => setIsOpen((prev) => !prev)} className="z-[99999] ">
        <div
          className={`w-fit top-full absolute  mt-1 bg-[var(--pattern_5)] rounded-xl shadow-lg ${
            authUser?.uid === message?.senderId ? "top-0 " : "top-0 "
          }`}
        >
          {children}
        </div>
      </div>
    </DropDownContext.Provider>
  );
};
//create child component

export const MenuItem = ({ value }: { value: string }) => {
  const { selection, setSelection } = useDropDown();

  return (
    <div className="rounded-xl bg-[var(--pattern_5)] flex flex-col">
      <div
        className=" bg-[var(--pattern_5)] hover:bg-gray-800 p-2 pl-3 rounded-xl"
        onClick={() => setSelection(value)}
      >
        {value}
      </div>
    </div>
  );
};
