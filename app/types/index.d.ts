import { store } from "../lib/redux/store";

//app types

export type AuthUser = {
    // or user
    _id?: string;
    uid: string;
    email: string;
    dp: string;
    name: string;
};

export type Message = {
    _id?: string;
    chatId: string;
    senderId: string;
    receiverId: string;
    content: string;
    status: "sent";
};
// type Participants = {
//     uid: string;
//     email
//     name: string;
// };
type Unread = {
    userId: string;
    count: string;
};
export type ChatsType = {
    _id?: string;
    uid: string;
    friendId: string;
    friendName: string;
    friendEmail: string;
    friendDp: string;
    chatId: string;
    participants: AuthUser[];
    lastMessage: string;
    unreadCount: Unread[];
};

//this type is use to switch between the chat list layout and the chat info layout
export type SectionType = {
    section: string;
};
//redux types
export type PusherChatState = ReturnType<typeof store.getState>;
export type PusherChatDispatch = typeof store.dispatch;
