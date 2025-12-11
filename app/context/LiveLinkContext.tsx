import React, { createContext, ReactNode, useContext, useState } from "react";
interface LiveLinkContextType {
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

//create context to share states
export const LiveLinkContext = createContext<LiveLinkContextType | null>(null);

export const LiveLink = ({ children }: { children: ReactNode }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <LiveLinkContext.Provider value={{ openModal, setOpenModal }}>
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
