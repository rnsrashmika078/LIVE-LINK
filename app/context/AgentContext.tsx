"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { AgentType } from "../types";

type AgentContextType = {
  messages: AgentType[];
  setMessages: React.Dispatch<React.SetStateAction<AgentType[]>>;
  agentIsOpen: boolean;
  setAgentIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const AgentContext = createContext<AgentContextType | null>(null);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<AgentType[]>([]);
  const [agentIsOpen, setAgentIsOpen] = useState<boolean>(false);

  return (
    <AgentContext.Provider
      value={{
        messages,
        setMessages,
        agentIsOpen,
        setAgentIsOpen,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export const useAgentContext = () => {
  const context = useContext(AgentContext);
  if (!context)
    throw new Error("useAgentContext must use within Agent Layout/ Component");

  return context;
};
