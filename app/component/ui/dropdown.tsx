/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useClickFocus } from "@/app/hooks/useHooks";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type SelectProps = {
  children?: ReactNode;
  onSelect?: (selection: string) => void;
};
type SelectContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selection: string | null;
  setSelection: (value: string) => void;
};
const DropDownContext = createContext<SelectContextType | null>(null);
const DropDown = ({ children, onSelect }: SelectProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selection, setSelection] = useState<string | null>("Llama3.2");
  const focusRef = useRef<HTMLDivElement | null>(null);
  const focus = useClickFocus(focusRef).toLowerCase();

  const handleSelection = (select: string | null) => {
    if (!select) return;
    setSelection(select);
    onSelect?.(select);
  };

  useEffect(() => {
    if (focus.toLowerCase().includes("outside")) {
      setOpen(false);
    }
  }, [focus]);
  return (
    <DropDownContext.Provider
      value={{
        open,
        setOpen,
        selection,
        setSelection: handleSelection,
      }}
    >
      <div
        ref={focusRef}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className={`w-fit border text-sm border-gray-500 shadow-xl  bg-gradient-to-br from-dark to-black/70 p-2 rounded-xl`}
      >
        {selection}
        {open && children}
      </div>
    </DropDownContext.Provider>
  );
};

export const DropDownItem = ({
  value,
  selectDefault,
}: {
  value: string;
  selectDefault?: boolean;
}) => {
  const { setOpen, setSelection } = useSelectContext();

  useEffect(() => {
    if (!selectDefault) return;
    setSelection(value);
  }, [selectDefault, value]);

  return (
    <div
      className="text-xs gap-3 w-full hover:bg-[#323131] px-2 py-1 rounded-md flex items-center"
      onClick={(e) => {
        e.stopPropagation();
        setSelection(value);
        setOpen(false);
      }}
    >
      {value}
    </div>
  );
};

export default DropDown;

const useSelectContext = () => {
  const context = useContext(DropDownContext);
  if (!context) throw new Error("younger the soul...tighter the hole");
  return context;
};
