import { store } from "../lib/redux/store";

//app types
export type FileType = {
  format: string;
  url: string;
  name: string;
  asset_id: string;
};
export type PreviewDataType = {
  url: string;
  type: string;
  name: string;
};
export type SeenType = {
  state?: string;
  receiverId: string;
  senderId: string;
  chatId: string;
};
export type TypingUser = {
  userId: string;
  chatId: string;
  isTyping: boolean;
};
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
export type SaveMessagePayload = {
  content: string;
  senderId: string;
  receiverId: string;
  chatId: string;
  name: string;
  dp: string;
  createdAt: string;
  status: string;
  files?: FileType;
  unreads?: Unread[];
};

export type Message = {
  _id?: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type?: string;
  userId?: string;
  isTyping?: boolean;
  status?: "sent" | "delivered" | "seen";
  createdAt?: string;
};

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
  files?: FileType;
  receiverId?: string;
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
