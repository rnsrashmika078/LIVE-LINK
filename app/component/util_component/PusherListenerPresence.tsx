"use client";
import { useEffect } from "react";
import Pusher from "pusher-js";
import { useDispatch, useSelector } from "react-redux";
import { PusherChatDispatch, PusherChatState } from "@/app/types";
import { setPusherMessages } from "@/app/lib/redux/chatslicer";

type MessageType = {
    from: string;
    senderId: string;
    message: string;
    targetUserId: string;
};

export default function PusherListenerPresence({
    user_id,
}: {
    user_id: string | undefined;
}) {
    const dispatch = useDispatch<PusherChatDispatch>();
    const activeChat = useSelector(
        (store: PusherChatState) => store.chat.activeChat
    );

    useEffect(() => {
        if (!user_id) {
            console.log("NO USER ID FOUND!")
            return;
        }
        console.log("🙌 pusher connected!");
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            authEndpoint: "/api/pusher/auth",
            auth: {
                headers: {
                    "X-User-Id": user_id,
                },
            },
        });

        // const presenceChannel = pusher.subscribe("presence-users");

        const channel = pusher.subscribe(`presence-user-${activeChat?.chatId}`);
        // const channel = pusher.subscribe(`presence-user-${activeChat?.chatId}`);
        const privateChannel = pusher.subscribe(`private-chat-${user_id}`);

        // if (!presenceChannel || !channel) {
        //     return;
        // }
        // // dispatch(setPusherChannel(privateChannel));
        // presenceChannel.bind(
        //     "pusher:subscription_succeeded",
        //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     (members: { members: Record<string, any["info"]> }) => {
        //         const initialMembers = Object.entries(members.members).map(
        //             ([id, info]) => ({
        //                 id,
        //                 info,
        //             })
        //         );
        //         // dispatch(setOnlineUsers(initialMembers));
        //     }
        // );

        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // presenceChannel.bind("pusher:member_added", (member: any) => {
        //     // dispatch(joinedUser(member));
        // });

        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // presenceChannel.bind("pusher:member_removed", async (member: any) => {
        //     // dispatch(leftUser(member));
        //     // await updateLastSeen(member.id);
        // });

        channel.bind("pusher:subscription_error", (error: MessageType) => {
            console.log(error instanceof Error ? error.message : undefined);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        channel.bind("chat", (data: any) => {
            // dispatch(setLiveMessages(data));
            alert(JSON.stringify(data));
            dispatch(setPusherMessages(data));
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
            pusher.unsubscribe(`presence-user-${activeChat?.chatId}`);
            pusher.disconnect();
        };
    }, [activeChat?.chatId, dispatch, user_id]);

    return null;
}
