import { useLiveLink } from "@/app/context/LiveLinkContext";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { CgClose } from "react-icons/cg";

import { ParticipantsType, PusherChatState } from "@/app/types";
import { useSelector } from "react-redux";
import MessageInfo from "./MessageInfo";
import ChatInfo from "./ChatInfo";

const InfoLayout = () => {
  const { setActionMenuSelection, actionMenuSelection } = useLiveLink();
  const participants = useSelector(
    (store: PusherChatState) => store.chat.activeChat?.participants
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 0, scale: 0.8, opacity: 0 }}
        animate={{ x: 0, scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="pattern_2 z-[999] fixed top-0 right-0 p-5 w-[350px] h-full"
      >
        <div className="flex justify-center items-start ">
          <CgClose
            onClick={() =>
              setActionMenuSelection({ selection: "", message: null })
            }
          />
          <h1 className="w-full text-end">{actionMenuSelection.selection}</h1>
        </div>
        {actionMenuSelection.selection.includes("message-info") && (
          <MessageInfo msg={actionMenuSelection.message!} />
        )}
        {actionMenuSelection.selection.includes("chat-info") && (
          <ChatInfo
            msg={actionMenuSelection.message!}
            participants={participants as ParticipantsType[]}
          />
        )}
        {/* <ChatInfo /> */}
      </motion.div>
    </AnimatePresence>
  );
};
export default InfoLayout;
