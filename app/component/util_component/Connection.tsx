"use client";
import { useLiveLink } from "@/app/context/LiveLinkContext";
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

  if (connectionState) return;
  return (
    <div className="text-4xl fixed top-0 left-0 h-full w-full pointer-events-none flex justify-center items-center z-[99999]">
      <div>You are {connectionState ? "Online" : "Offline"}</div>
    </div>
  );
};

export default Connection;
