"use client";
import { useSelector } from "react-redux";
import { PusherChatState } from "../types";
import { useEffect, useState } from "react";

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

export function useDebounce(input: string, delay: number) {
  const [debounceInput, setDebounceInput] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceInput(input);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [delay, input]);

  return debounceInput;
}
