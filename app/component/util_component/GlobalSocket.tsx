/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  connectUser,
  disconnectUser,
  setGroupChats,
  setGroupMessageSeen,
  setTypingUsers,
} from "@/app/lib/redux/chatslicer";
import { setNotification } from "@/app/lib/redux/notificationSlicer";
import {
  ActiveUsersType,
  PusherChatDispatch,
  PusherChatState,
  TypingUser,
} from "@/app/types";
import { useEffect } from "react";
import { useSocket } from "./SocketProvider";
import { useDispatch, useSelector } from "react-redux";
import { useLiveLink } from "@/app/context/LiveLinkContext";

const GlobalSocket = () => {
  const dispatch = useDispatch<PusherChatDispatch>();
  const socket = useSocket();
  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);

  const { countRef } = useLiveLink();
  useEffect(() => {
    if (!socket || !authUser?.uid) return;

    const connectToChat = (data: ActiveUsersType) => {
      console.log(`joined: ${JSON.stringify(data)}`);
      dispatch(connectUser(data));
      // this is for group chats only
    };
    const disconnectFromChat = (data: ActiveUsersType) => {
      console.log(`leave: ${JSON.stringify(data)}`);
      dispatch(disconnectUser(data));

      // this is for group chats only
    };
    const typingHandler = (data: TypingUser) => {
      // alert(JSON.stringify(data.chatId));
      if (data.type === "Individual") {
        if (data.userId === authUser?.uid) return;
        // const id = new Date().getTime().toString();
        // dispatch(setNotification({ id, notify: data.type + " is typing!" }));

        dispatch(setTypingUsers(data));
      } else if (data.type === "Group") {
        if (data.userId === authUser?.uid) return;
        dispatch(setTypingUsers(data));
      }
    };

    const messageSeenHandler = (data: any) => {
      countRef.current[data.chatId + "-" + data.receiverId] = 0;
      const id = new Date().getTime().toString();
      dispatch(
        setGroupMessageSeen({
          chatId: data.chatId,
          receiverId: data.receiverId, // message seen by
          senderId: data.senderId, // message send by
          state: id,
        })
      );
    };
    const notificationHandler = (data: any) => {
      if (data.createdBy === authUser?.uid) {
        dispatch(setGroupChats(data));
      }
      dispatch(setGroupChats(data));
      const id = Date.now().toString();
      dispatch(setNotification({ notify: data.message || "", id }));
    };
    socket.on("seen-success", messageSeenHandler);
    socket.on("typing-status", typingHandler);
    socket.on("send-group-notification", notificationHandler);
    socket.on("connected-to-chat", connectToChat);
    socket.on("disconnected-from-chat", disconnectFromChat);

    return () => {
      socket.off("send-group-notification", notificationHandler);
      socket.off("typing-status", typingHandler);
      socket.off("seen-success", messageSeenHandler);
    };
  }, [authUser?.uid, , socket]);

  return null;
};

export default GlobalSocket;
