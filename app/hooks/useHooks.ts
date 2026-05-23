/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSelector } from "react-redux";
import { AuthUser, Message, PusherChatState } from "../types";
import { useEffect, useRef, useState } from "react";
import { useMessageDelete } from "../lib/tanstack/messageQuery";
import { useLiveLink } from "../context/LiveLinkContext";

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

export function useActionMenuOperation() {
  const [result, setResult] = useState<any>("");
  const { setActionMenuSelection } = useLiveLink();

  const { mutate: deleteMessage } = useMessageDelete((result) => {
    if (result) {
      setResult(result);
    }
  });
  const handleOperation = (
    value: string,
    messageId: string,
    chatId: string,
    public_id: string,
    message: Message
  ) => {
    if (!value) return;
    if (value === "Delete") {
      setActionMenuSelection({ selection: value, message });
      deleteMessage({
        messageId,
        public_id,
        chatId,
      });
      return;
    } else if (value === "Info") {
      setActionMenuSelection({ selection: "message-info", message });
      return;
    } else {
      return;
    }
  };

  return { result, handleOperation };
}

export function useElapsedTime(condition: boolean) {
  const startAtRef = useRef<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string | null>(null);

  useEffect(() => {
    if (!condition) {
      startAtRef.current = null;
      setElapsedTime(null);
      return;
    }
    startAtRef.current = Date.now();
    const interval = setInterval(() => {
      if (!startAtRef.current) {
        return;
      }
      const diff = Date.now() - startAtRef.current; // this is the time difference in milliseconds
      const timeDiffInSec = Math.floor(diff / 1000); // this is the time difference in seconds
      const minute = Math.floor(timeDiffInSec / 60);
      const seconds = timeDiffInSec % 60;
      const format = `${minute.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;

      setElapsedTime(format);
    }, 1000);

    return () => clearInterval(interval);
  }, [condition]);

  return elapsedTime ? elapsedTime : null;
}
