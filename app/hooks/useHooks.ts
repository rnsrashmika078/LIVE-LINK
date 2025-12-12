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
  // ? new Date(lastSeen).toLocaleTimeString()
  // : "Offline";
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

export function useClickFocus(
  ref: React.RefObject<HTMLDivElement | null>
): string {
  const [clickArea, setClickArea] = useState<string | null>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref && ref.current && !ref.current.contains(e.target as Node)) {
        setClickArea("OutSide");
      } else {
        setClickArea("Inside");
      }
    };
    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return clickArea ?? "Outside";
}
