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
  setMessages,
  setMessagesArray,
} from "@/app/lib/redux/chatslicer";
import { Message } from "@/app/types/index";
type MessageType = {
  from: string;
  senderId: string;
  message: string;
  targetUserId: string;
};

export default function PusherListenerPresence() {
  const dispatch = useDispatch<PusherChatDispatch>();
  const activeChat = useSelector(
    (store: PusherChatState) => store.chat.activeChat
  );
  const chats = useSelector((store: PusherChatState) => store.chat.chats);

  const authUser = useSelector((store: PusherChatState) => store.chat.authUser);
  useEffect(() => {
    if (!authUser?.uid) {
      console.log("NO USER ID FOUND!");
      return;
    }
    console.log("pusher connected!");
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
      auth: {
        headers: {
          "X-User-Id": authUser?.uid,
          "X-User-name": authUser?.name,
          "X-User-email": authUser?.email,
          "X-User-dp": authUser?.dp,
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chat_channels: Record<string, any> = {}; //[chaId:string] : boolean
    chats.forEach((chat) => {
      const channel = pusher.subscribe(`presence-message-${chat.chatId}`);
      console.log("🙌🧩👩‍🦰😍connected");
      channel.bind("pusher:subscription_error", (error: MessageType) => {
        console.log(error instanceof Error ? error.message : undefined);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      channel.bind("pusher:subscription_succeeded", (members: any) => {
        // console.log("memebers", members);
        // console.log("me", members.me);
        console.log("RAW", members);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onlineUsers: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        members.each((m: any) => {
          onlineUsers.push({
            uid: m.info.userId,
            name: m.info.name,
            email: m.info.email,
            dp: m.info.dp,
          });
        });
        dispatch(setOnlineUsers(onlineUsers));
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      channel.bind("pusher:member_added", (member: any) => {
        // dispatch(joinedUser(member));
        console.log("member", member);
        // console.log(member.info?.name, "joined");
        const joinedUser = {
          uid: member.info?.userId,
          name: member.info?.name,
          email: member.info?.email,
          dp: member.info?.dp,
        };
        dispatch(setJoinedUser(joinedUser));
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      channel.bind("pusher:member_removed", async (member: any) => {
        const leftUser = {
          uid: member.info?.userId,
          name: member.info?.name,
          email: member.info?.email,
          dp: member.info?.dp,
        };
        dispatch(setLeftUser(leftUser));
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      channel.bind("message", (data: Message) => {
        dispatch(setMessages(data));
        dispatch(setMessagesArray(data));
      });
      chat_channels[chat.chatId] = channel;
    });

    const notify_channel = pusher.subscribe(`presence-notify-${authUser?.uid}`);
    const init_chat = pusher.subscribe(`presence-init-chat-${authUser?.uid}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    notify_channel.bind("notify", (data: AuthUser) => {
      // alert(JSON.stringify(data));
      const id = new Date().toLocaleTimeString();
      dispatch(setNotification({ notify: data.message || "", id }));
      if (data.type === "friend_request") {
        dispatch(setFriendRequest(data));
      } else if (data.type === "friend_accept") {
        dispatch(setFriends(data));
      }
    });

    init_chat.bind("init-chat", (data: ChatsType) => {
      console.log(JSON.stringify(data));
      const id = new Date().toLocaleTimeString();
      dispatch(setNotification({ notify: data.message || "", id }));
      dispatch(setChats([data]));
    });
    // privateChannel.bind(
    //     "seen-message",
    //     (data: {
    //         messageId: string;
    //         conversationId: string;
    //         seen: boolean;
    //     }) => {
    //         dispatch(setSeenMessageStatus(data));
    //     }
    // );
    return () => {
      Object.values(chat_channels).forEach((channel) => channel.unbind_all());

      pusher.unsubscribe(`presence-notify-${authUser?.uid}`);
      pusher.unsubscribe(`presence-init-chat-${authUser?.uid}`);
      pusher.disconnect();
    };
  }, [activeChat?.chatId, authUser?.uid, chats, dispatch]);

  return null;
}
