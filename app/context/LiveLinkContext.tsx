import React, { createContext, ReactNode, useContext, useState } from "react";
interface LiveLinkContextType {
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
  id: string;
  setId: (id: string) => void;
  setOnSelect: (value: string) => void;
  onSelect: string;
}

//create context to share states
export const LiveLinkContext = createContext<LiveLinkContextType | null>(null);

export const LiveLink = ({ children }: { children: ReactNode }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [onSelect, setOnSelect] = useState<string>("");
  const [id, setId] = useState<string>("");
  return (
    <LiveLinkContext.Provider
      value={{
        openModal,
        setOpenModal,
        onSelect,
        setOnSelect,
        id,
        setId,
      }}
    >
      {children}
    </LiveLinkContext.Provider>
  );
};

export const useLiveLink = () => {
  const context = useContext(LiveLinkContext);
  if (!context) {
    throw new Error("Must be use in under the LiveLink Layout");
  }
  return context;
};
export default LiveLink;
