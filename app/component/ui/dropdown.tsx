//create drop down menu

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

export const DropDown = ({ children, onSelect }: DropDownProps) => {
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
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="transition-all border p-1 rounded-xl pl-5 border-[var(--pattern_5)]"
      >
        <div className="flex justify-between gap-1">
          <p>{selection ? selection : "Select Option"}</p>
          <div className={`transition-all duration-500 ${isOpen ? "rotate-0" : "rotate-180"}`}>
            <MdArrowDropDown size={25} />
          </div>
        </div>

        {isOpen && children}
      </div>
    </DropDownContext.Provider>
  );
};
//create child component

export const MenuItem = ({ value }: { value: string }) => {
  const { selection, setSelection } = useDropDown();

  return (
    <div>
      {selection !== value && (
        <div className="hover:bg-gray-800 p-1 rounded-xl " onClick={() => setSelection(value)}>
          {value}
        </div>
      )}
    </div>
  );
};
