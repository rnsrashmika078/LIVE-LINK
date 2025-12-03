"use client";
import { AuthUser, ChatsType, Message } from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ReduxChatState = {
  activeChat: ChatsType | null;
  authUser: AuthUser | null;
  messages: Message | null;
  messagesArray: Message[];
  chats: ChatsType[];
};
const initialState: ReduxChatState = {
  activeChat: null,
  authUser: null,
  messages: null,
  chats: [],
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
      state.chats = [...action.payload];
    },
  },
});
export const {
  setActiveChat,
  setAuthUser,
  setChats,
  setMessages,
  setMessagesArray,
} = chatSlicer.actions;
export default chatSlicer.reducer;
