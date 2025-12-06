import { store } from "../lib/redux/store";

//app types

export type AuthUser = {
  // or user
  _id?: string;
  uid: string;
  email: string;
  dp: string;
  name: string;
  message?: string;
  type?: string;
  createdAt?: string;
};

export type Message = {
  _id?: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  status?: "sent" | "delivered" | "seen";
  createdAt?: string;
};
// type Participants = {
//     uid: string;
//     email
//     name: string;
// };
type Unread = {
  userId: string;
  count: number;
};
export type ChatsType = {
  _id?: string;
  chatId: string;
  uid: string;
  name: string;
  email: string;
  dp: string;
  lastMessage: string;
  type?: string;
  senderId?: string;
  message?: string;
  unreadCount?: Unread[];
  createdAt?: string;
  updatedAt?: string;
  status?: "sent" | "delivered" | "seen";
};

//this type is use to switch between the chat list layout and the chat info layout
export type SectionType = {
  section: string;
};
//redux types
export type PusherChatState = ReturnType<typeof store.getState>;
export type PusherChatDispatch = typeof store.dispatch;
