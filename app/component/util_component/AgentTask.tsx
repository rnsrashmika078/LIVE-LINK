import { useLiveLink } from "@/app/context/LiveLinkContext";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { parse } from "jsonc-parser";
import { useEffect } from "react";
const AgentTask = () => {
  const { agentTask, chatRefs } = useLiveLink();

  console.log("agent task", agentTask);
  const handler = () => {
    const data = parse(agentTask);
    if (!data) return;
    if (!data.function) return;
    console.log(data.function.chatId);
    // if (!chatRefs.current[data.function.chatId]) return;
    chatRefs.current[data.function.chatId]?.click();
  };

  useEffect(() => {
    handler();
  }, [agentTask]);

  
  console.log(chatRefs);
  if (agentTask.includes("glow-button"))
    return (
      <AnimatePresence>
        <Button onClick={handler}>CLICK</Button>
        <motion.div
          initial={{ y: 0, x: 0 }}
          animate={{
            x: [0, 100, 0],
            y: [100, 0, 100],
            backgroundColor: ["#ff0000", "#00ff00", "#0000ff", "#ff0000"], // loop colors
          }} // loop movement: start → 100px → start
          transition={{ repeat: Infinity }}
          className="fixed bg-red-500 w-5 h-5 z-[9999] rounded-full"
        ></motion.div>
      </AnimatePresence>
    );
};

export default AgentTask;
