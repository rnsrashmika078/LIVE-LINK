"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { PreviewDataType, StatusType } from "../types";

type StatusContextType = {
  statusState: StatusType[] | null;
  setStatusState: React.Dispatch<React.SetStateAction<StatusType[] | null>>;
  preview: PreviewDataType | null;
  setPreview: React.Dispatch<React.SetStateAction<PreviewDataType | null>>;
  setEmoji: (e: string) => void;
  setBack: React.Dispatch<React.SetStateAction<boolean>>;
  back: boolean;
  emoji: string | null;
  currentState:
    | "viewing-text"
    | "viewing-photo"
    | "updating-photo"
    | "updating-text"
    | "idle"
    | "selecting";
  setCurrentState: (
    state:
      | "viewing-text"
      | "viewing-photo"
      | "updating-photo"
      | "updating-text"
      | "idle"
      | "selecting"
  ) => void;
  userStatus: StatusType | null;
  setUserStatus: React.Dispatch<React.SetStateAction<StatusType | null>>;
};
const StatusContext = createContext<StatusContextType | null>(null);

export const StatusProvider = ({ children }: { children: ReactNode }) => {
  const [statusState, setStatusState] = useState<StatusType[] | null>(null);
  const [preview, setPreview] = useState<PreviewDataType | null>(null);
  const [back, setBack] = useState<boolean>(false);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState<
    | "viewing-text"
    | "viewing-photo"
    | "updating-photo"
    | "updating-text"
    | "idle"
    | "selecting"
  >("idle");
  const [userStatus, setUserStatus] = useState<StatusType | null>(null);

  return (
    <StatusContext.Provider
      value={{
        statusState,
        setStatusState,
        preview,
        setPreview,
        currentState,
        setCurrentState,
        userStatus,
        setUserStatus,
        emoji,
        setEmoji,
        back,
        setBack,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};

export const useStatusContext = () => {
  const context = useContext(StatusContext);
  if (!context)
    throw new Error(
      "UseStatusContext must use within Status Layout/ Component"
    );

  return context;
};
