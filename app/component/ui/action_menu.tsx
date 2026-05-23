import { Message } from "@/app/types";
import { createContext, ReactNode, useContext, useState } from "react";

//context type
type MenuContextType = {
  selection: string;
  setSelection: (selection: string) => void;
};

//create context
const MenuContext = createContext<MenuContextType | null>(null);

//use hook
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu hook should be use within the Menu Component");
  }
  return context;
};

export function Menu({
  id,
  msg,
  children,
  setId,
  onSelect,
  condition,
}: {
  id: string;
  msg: Message;
  children: ReactNode;
  setId?: (id: string) => void;
  onSelect?: (value: string) => void;
  condition?: boolean;
}) {
  const [selection, setSelection] = useState<string>("");
  const handleSelection = (value: string) => {
    setSelection(value);
    if (setId) setId("");
    if (onSelect) onSelect(value);
  };
  let dynamicStyles;
  if (condition !== undefined) {
    dynamicStyles = `${condition ? "right-0" : "left-0"}`;
  }

  return (
    <MenuContext.Provider value={{ selection, setSelection: handleSelection }}>
      <div onSelect={() => handleSelection}>
        {id === msg.customId && (
          <div
            className={`z-[9999] pattern_2  absolute rounded-xl pointer-events-auto ${dynamicStyles}`}
          >
            {children}
          </div>
        )}
      </div>
    </MenuContext.Provider>
  );
}
export function MenuItem({ value }: { value: string }) {
  const { setSelection } = useMenu();

  return (
    <div
      className="hover:bg-[var(--pattern_5)] first:rounded-t-xl last:rounded-b-xl  px-3 py-2"
      onClick={() => setSelection(value)}
    >
      {value}
    </div>
  );
}
