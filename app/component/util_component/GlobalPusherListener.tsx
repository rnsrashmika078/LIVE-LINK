"use client";
import { useEffect } from "react";
import Pusher from "pusher-js";
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

export default function GlobalPusherListener() {
  const dispatch = useDispatch<PusherChatDispatch>();

  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );

  useEffect(() => {
    if (!activeChat?.uid) {
      return;
    }
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
      // auth: {
      //   headers: {
      //     "X-User-Id": authUser?.uid,
      //   },
      // },
    });

    const message_seen = pusher.subscribe(
      `private-message-seen-${activeChat?.uid}`
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message_seen.bind("message-seen", (data: any) => {
      const id = new Date().getTime().toString();
      // alert(id);
      dispatch(
        setMessageSeen({
          chatId: data?.chatId,
          receiverId: data?.receiverId,
          senderId: data?.senderId,
          state: id,
        })
      );
      // dispatch(setNotification({ notify: "your message seen", id }));
    });

    return () => {
      pusher.unsubscribe(`private-message-seen-${activeChat?.uid}`);
      pusher.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat?.uid]);

  useEffect(() => {
    if (!authUser?.uid) {
      return;
    }
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
      auth: {
        headers: {
          "X-User-Id": authUser?.uid,
        },
      },
    });

    const notify_channel = pusher.subscribe(`private-notify-${authUser?.uid}`);
    const onlineUserPresence = pusher.subscribe(`presence-global`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    notify_channel.bind("notify", (data: AuthUser | ChatsType) => {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onlineUserPresence.bind("pusher:subscription_succeeded", (members: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onlineUsers: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      members.each((m: any) => {
        onlineUsers.push(m.info?.userId);
      });
      dispatch(setOnlineUsers(onlineUsers));
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onlineUserPresence.bind("pusher:member_added", (member: any) => {
      dispatch(setJoinedUser(member.info?.userId));
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onlineUserPresence.bind("pusher:member_removed", async (member: any) => {
      dispatch(setLeftUser(member.info?.userId));
    });
    return () => {
      pusher.unsubscribe(`private-notify-${authUser?.uid}`);
      pusher.unsubscribe("presence-global");
      pusher.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.uid]);

  return null;
}
