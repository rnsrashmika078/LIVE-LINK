/* eslint-disable @typescript-eslint/no-explicit-any */
import { setGroupChats } from "@/app/lib/redux/chatslicer";
import { setNotification } from "@/app/lib/redux/notificationSlicer";
import { PusherChatDispatch, PusherChatState } from "@/app/types";
import { useEffect } from "react";
import { useSocket } from "./SocketProvider";
import { useDispatch, useSelector } from "react-redux";

const GlobalSocket = () => {
  const dispatch = useDispatch<PusherChatDispatch>();
  const socket = useSocket();
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);

  useEffect(() => {
    if (!socket) return;

    const handler = (data: any) => {
      if (data.createdBy === authUser?.uid) {
        dispatch(setGroupChats(data));
        return () => {
          socket.off("send-group-notification", handler);
        };
      }
      dispatch(setGroupChats(data));
      const id = Date.now().toString();
      dispatch(setNotification({ notify: data.message || "", id }));
    };

    socket.on("send-group-notification", handler);

    return () => {
      socket.off("send-group-notification", handler);
    };
  }, [authUser?.uid, dispatch, socket]);

  return null;
};

export default GlobalSocket;
