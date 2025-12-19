/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  AuthUser,
  ChatsType,
  DeletedMessage,
  GroupType,
  Message,
  SeenType,
  TypingUser,
} from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ReduxChatState = {
  activeChat: ChatsType | GroupType | null;
  authUser: AuthUser | null;
  messages: Message | null;
  messagesArray: Message[];
  messageSeen: SeenType;
  unreads: number;
  chats: ChatsType[] | GroupType[];
  typingUsers: TypingUser[];
  chatArray: ChatsType[];
  deletedMessage: DeletedMessage[];
  debouncedText: string;
  groupChats: GroupType[];
};
const initialState: ReduxChatState = {
  activeChat: null,
  authUser: null,
  messages: null,
  chats: [],
  unreads: 0,
  chatArray: [],
  groupChats: [],
  typingUsers: [],
  messageSeen: { state: "", chatId: "", receiverId: "", senderId: "" },
  messagesArray: [],
  debouncedText: "",
  deletedMessage: [],
};
const chatSlicer = createSlice({
  name: "chatslicer",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.authUser = action.payload;
    },
    setActiveChat: (
      state,
      action: PayloadAction<ChatsType | GroupType | null>
    ) => {
      state.activeChat = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message>) => {
      state.messages = action.payload;
    },
    setMessagesArray: (state, action: PayloadAction<Message>) => {
      state.messagesArray.push(action.payload);
    },
    setChats: (state, action: PayloadAction<any>) => {
      state.chats = [...state.chats, ...action.payload];
    },
    setGroupChats: (state, action: PayloadAction<GroupType | GroupType[]>) => {
      if (Array.isArray(action.payload)) {
        state.groupChats = [...state.groupChats, ...action.payload];
      } else {
        state.groupChats = [...state.groupChats, action.payload];
      }
    },
    setMessageSeen: (state, action: PayloadAction<SeenType>) => {
      state.messageSeen = {
        ...state.messageSeen,
        chatId: action.payload.chatId,
        receiverId: action.payload.receiverId,
        senderId: action.payload.senderId,
        state: action.payload.state,
      };
    },
    setChatsArray: (state, action: PayloadAction<ChatsType>) => {
      const exist = state.chatArray.some(
        (c) => c.chatId === action.payload.chatId
      );
      if (!exist) {
        state.chatArray = [...state.chatArray, action.payload];
      }
    },
    setUnreads: (state, action: PayloadAction<number>) => {
      state.unreads = action.payload;
    },
    setTypingUsers: (state, action: PayloadAction<TypingUser>) => {
      const exist = state.typingUsers.some(
        (u) => u.userId === action.payload.userId
      );
      if (exist) {
        state.typingUsers = state.typingUsers.map((u) =>
          u.userId === action.payload.userId
            ? { ...u, isTyping: action.payload.isTyping }
            : u
        );
        return;
      }
      state.typingUsers.push(action.payload);
    },
    setDeletedMessage: (state, action: PayloadAction<DeletedMessage>) => {
      const exist = state.deletedMessage.some(
        (u) => u.chatId === action.payload.chatId
      );
      if (exist) {
        state.deletedMessage = state.deletedMessage.map((u) =>
          u.chatId === action.payload.chatId
            ? { ...u, messageId: action.payload.messageId }
            : u
        );
        return;
      }
      state.deletedMessage.push(action.payload);
    },
    setDebouncedText: (state, action: PayloadAction<string>) => {
      state.debouncedText = action.payload;
    },
  },
});
export const {
  setActiveChat,
  setAuthUser,
  setUnreads,
  setChats,
  setMessageSeen,
  setMessages,
  setDeletedMessage,
  setMessagesArray,
  setChatsArray,
  setTypingUsers,
  setDebouncedText,
  setGroupChats,
} = chatSlicer.actions;
export default chatSlicer.reducer;
