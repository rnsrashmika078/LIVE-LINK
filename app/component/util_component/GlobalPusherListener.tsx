/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AuthUser,
  ChatsType,
  PusherChatDispatch,
  PusherChatState,
} from "@/app/types";
import { setNotification } from "@/app/lib/redux/notificationSlicer";
import {
  setFriendRequest,
  setFriends,
  setJoinedUser,
  setLeftUser,
  setOnlineUsers,
} from "@/app/lib/redux/friendsSlicer";
import {
  setChats,
  setChatsArray,
  setMessageSeen,
} from "@/app/lib/redux/chatslicer";
import { usePusher } from "./PusherProvider";

export default function GlobalPusherListener() {
  const dispatch = useDispatch<PusherChatDispatch>();

  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );
  const pusher = usePusher();

  useEffect(() => {
    if (!activeChat?.uid || !pusher) return;

    const channelName = `private-message-seen-${activeChat.uid}`;

    if (!pusher.channel(channelName)) {
      const channel = pusher.subscribe(channelName);

      channel.bind("message-seen", (data: any) => {
        const id = Date.now().toString();
        dispatch(
          setMessageSeen({
            chatId: data.chatId,
            receiverId: data.receiverId,
            senderId: data.senderId,
            state: id,
          })
        );
      });
    }

    return () => {
      if (pusher.channel(channelName)) {
        pusher.unsubscribe(channelName);
      }
    };
  }, [activeChat?.uid, dispatch, pusher]);

  useEffect(() => {
    if (!authUser?.uid || !pusher) return;

    const notifyName = `private-notify-${authUser.uid}`;
    const presenceName = `presence-global`;

    const notify = pusher.channel(notifyName) || pusher.subscribe(notifyName);
    const presence =
      pusher.channel(presenceName) || pusher.subscribe(presenceName);

    notify.bind("notify", (data: AuthUser | ChatsType) => {
      const id = new Date().toLocaleTimeString();
      dispatch(setNotification({ notify: data.message || "", id }));
      if (data.type === "friend_request") {
        dispatch(setFriendRequest(data as AuthUser));
      } else if (data.type === "friend_accept") {
        dispatch(setFriends(data as AuthUser));
      } else if (data.type === "create_initial_chat") {
        const id = new Date().toLocaleTimeString();
        dispatch(setNotification({ notify: data.message || "", id }));
        dispatch(setChats([data as ChatsType]));
        dispatch(setChatsArray(data as ChatsType));
      }
    });

    presence.bind("pusher:subscription_succeeded", (members: any) => {
      const onlineUsers: any[] = [];
      members.each((m: any) => {
        onlineUsers.push(m.info?.userId);
      });
      dispatch(setOnlineUsers(onlineUsers));
    });

    presence.bind("pusher:member_added", (member: any) => {
      dispatch(setJoinedUser(member.info?.userId));
    });

    presence.bind("pusher:member_removed", async (member: any) => {
      dispatch(setLeftUser(member.info?.userId));
    });
    return () => {
      if (pusher.channel(notifyName)) pusher.unsubscribe(notifyName);
      if (pusher.channel(presenceName)) pusher.unsubscribe(presenceName);
    };
  }, [authUser?.uid, dispatch, pusher]);

  return null;
}
