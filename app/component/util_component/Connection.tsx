"use client";
import { useLiveLink } from "@/app/context/LiveLinkContext";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const Connection = () => {
  const { setConnectionState, connectionState } = useLiveLink();
  useEffect(() => {
    const handleNetworkConnectivity = () =>
      setConnectionState(navigator.onLine);

    window.addEventListener("online", handleNetworkConnectivity);
    window.addEventListener("offline", handleNetworkConnectivity);

    return () => {
      window.removeEventListener("online", handleNetworkConnectivity);
      window.removeEventListener("offline", handleNetworkConnectivity);
    };
  }, []);

  const variant = {
    initial: { y: 0 },
    animate: { y: 50 },
    exit: { y: 0 },
  };
  return (
    <AnimatePresence>
      {!connectionState && (
        <div className="text-sm fixed top-0 h-full w-full pointer-events-none flex justify-center z-[99999]">
          <motion.div
            className="border w-fit h-fit p-5 rounded-2xl border-red-500 shadow-2xl pattern_2"
            variants={variant}
            initial="initial"
            exit={"exit"}
            animate="animate"
          >
            You are {connectionState ? "back Online" : "Offline"}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default Connection;
