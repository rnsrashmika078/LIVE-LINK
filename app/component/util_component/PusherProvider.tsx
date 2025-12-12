/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/refs */
"use client";
import { PusherChatState } from "@/app/types";
import Pusher from "pusher-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,

  useState,
} from "react";
import { useSelector } from "react-redux";

const PusherContext = createContext<Pusher | null>(null);
export const PusherProvider = ({ children }: { children: ReactNode }) => {
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  // const pusherRef = useRef<Pusher | null>(null);
  const [pusher, setPusher] = useState<Pusher | null>(null);

  useEffect(() => {
    if (!authUser?.uid) return;

    if (!pusher) {
      const instance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        authEndpoint: "/api/pusher/auth",
        auth: {
          headers: { "X-User-Id": authUser?.uid },
        },
      });
      setPusher(instance);
    }

    return () => pusher?.disconnect();
  }, [authUser?.uid]);

  return (
    <PusherContext.Provider value={pusher}>{children}</PusherContext.Provider>
  );
};
export const usePusher = () => useContext(PusherContext);
