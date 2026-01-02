"use client";
import { useAgentContext } from "@/app/context/AgentContext";
import { useClickFocus } from "@/app/hooks/useHooks";
import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useEffect, useRef, useState } from "react";

const AgentWrapper = ({ children }: { children: ReactNode }) => {
  const { agentIsOpen } = useAgentContext();
  const [activeAgent, setActiveAgent] = useState<boolean>(false);

  const targetRef = useRef<HTMLDivElement | null>(null);
  const focus = useClickFocus(targetRef);

  useEffect(() => {
    return () => {
      setActiveAgent(false);
    };
  }, []);
  return (
    <div
      ref={targetRef}
      className={`fixed -right-7.5 pointer-events-auto z-[999] bg-green-500   rounded-t-xl text-sm top-1/2 ${
        !agentIsOpen ? "opacity-100" : "opacity-0"
      } -rotate-90 px-5`}
      onClick={() => {
        setActiveAgent(true);
      }}
    >
      <p className="text-black">Agent</p>
      <AnimatePresence>
        {activeAgent &&
          !agentIsOpen &&
          !focus.toLowerCase().includes("outside") &&
          children}
      </AnimatePresence>
    </div>
  );
};

export default AgentWrapper;
