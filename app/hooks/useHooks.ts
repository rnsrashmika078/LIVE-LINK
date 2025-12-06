"use client";
import { useSelector } from "react-redux";
import { PusherChatState } from "../types";

export function usePathName() {
  if (typeof window !== "undefined") {
    return window.location.pathname;
  } else {
    return "";
  }
}
export const useOnlinePresence = (uid: string): "Online" | "Offline" => {
  const onlineUser = useSelector((store: PusherChatState) =>
    store.friends.OnlineUsers.some((u) => u === uid)
  );

  return onlineUser ? "Online" : "Offline";
};
