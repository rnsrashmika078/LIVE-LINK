/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/refs */
"use client";
import { setFriends } from "@/app/lib/redux/friendsSlicer";
import { useGetFriends } from "@/app/lib/tanstack/friendsQuery";
import { PusherChatDispatch, PusherChatState } from "@/app/types";
import Pusher from "pusher-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

const PusherContext = createContext<Pusher | null>(null);
export const PusherProvider = ({ children }: { children: ReactNode }) => {
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const dispatch = useDispatch<PusherChatDispatch>();
  const [pusher, setPusher] = useState<Pusher | null>(null);

  const { data: result, isPending } = useGetFriends(authUser?.uid ?? "");

  useEffect(() => {
    if (result?.friends) {
      dispatch(setFriends(result?.friends));
    }
  }, [result?.friends]);

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

  useEffect(() => {
    return () => {
      pusher?.disconnect();
    };
  }, [pusher]);

  return (
    <PusherContext.Provider value={pusher}>{children}</PusherContext.Provider>
  );
};
export const usePusher = () => useContext(PusherContext);
