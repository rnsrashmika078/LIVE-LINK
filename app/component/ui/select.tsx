/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useClickFocus } from "@/app/hooks/useHooks";
import React, {
  createContext,
  ReactNode,
  useContext,
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
const SelectContext = createContext<SelectContextType | null>(null);
const Select = ({ children, onSelect }: SelectProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selection, setSelection] = useState<string | null>(null);

  const handleSelection = (select: string | null) => {
    if (!select) return;
    setSelection(select);
    onSelect?.(select);
  };
  const childArray = React.Children.toArray(children);
  const focusRef = useRef<HTMLDivElement | null>(null);
  const focus = useClickFocus(focusRef).toLowerCase();
  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        selection,
        setSelection: handleSelection,
      }}
    >
      <div
        ref={focusRef}
        onClick={(e) => {
          e.preventDefault();
          setOpen((prev) => !prev);
        }}
        className={`z-[99] relative w-full`}
      >
        {childArray[0]}
        {open && (!focus.toLowerCase().includes("outside") && childArray[1])}
      </div>
    </SelectContext.Provider>
  );
};
interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
export const Component = ({ children, ...props }: ComponentProps) => {
  return (
    <div {...props} className="py-2 relative w-full">
      {children}
    </div>
  );
};
interface SelectionSection extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
export const SelectionSection = ({ children }: SelectionSection) => {
  return (
    <div className="flex flex-col mt-2  absolute translate-x-15 pattern_3 rounded-2xl p-2 -translate-y-10">
      {children}
    </div>
  );
};
export const SelectItem = ({
  value,
  children,
}: {
  value: string;
  children?: ReactNode;
}) => {
  const { setOpen, setSelection } = useSelectContext();
  return (
    <div
      className="text-sm gap-3 hover:bg-[#323131] w-full p-2 rounded-md flex items-end"
      onClick={(e) => {
        e.stopPropagation();
        setSelection(value);
        setOpen(false);
      }}
    >
      {children}
    </div>
  );
};
export default Select;

const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("younger the soul...tighter the hole");
  return context;
};
