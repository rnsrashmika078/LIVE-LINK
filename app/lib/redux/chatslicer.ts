"use client";
import { AuthUser, ChatsType, Message } from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type SeenType = {
  state?: string;
  receiverId: string;
  senderId: string;
  chatId: string;
};
type ReduxChatState = {
  activeChat: ChatsType | null;
  authUser: AuthUser | null;
  messages: Message | null;
  messagesArray: Message[];
  messageSeen: SeenType;
  chats: ChatsType[];
  chatArray: ChatsType[];
};
const initialState: ReduxChatState = {
  activeChat: null,
  authUser: null,
  messages: null,
  chats: [],
  chatArray: [],
  messageSeen: { state: "", chatId: "", receiverId: "", senderId: "" },
  messagesArray: [],
};
const chatSlicer = createSlice({
  name: "chatslicer",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.authUser = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<ChatsType>) => {
      state.activeChat = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message>) => {
      state.messages = action.payload;
    },
    setMessagesArray: (state, action: PayloadAction<Message>) => {
      state.messagesArray.push(action.payload);
    },
    setChats: (state, action: PayloadAction<ChatsType[]>) => {
      // const exist = state.chats.some((c) =>
      //   action.payload.some((a) => a.chatId === c.chatId)
      // );
      // if (!exist) {
      state.chats = [...state.chats, ...action.payload];
      // }
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
  },
});
export const {
  setActiveChat,
  setAuthUser,
  setChats,
  setMessageSeen,
  setMessages,
  setMessagesArray,
  setChatsArray,
} = chatSlicer.actions;
export default chatSlicer.reducer;
