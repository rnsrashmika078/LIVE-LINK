"use client";
import { AuthUser, ChatsType, Message } from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type ActiveChat = {
    chatId: string;
    receiverId: string;
};
type ReduxChatState = {
    activeChat: ActiveChat | null;
    authUser: AuthUser | null;
    pusherMessages: Message[];
    chats: ChatsType[];
};
const initialState: ReduxChatState = {
    activeChat: null,
    authUser: null,
    pusherMessages: [],
    chats: [],
};
const chatSlicer = createSlice({
    name: "chatslicer",
    initialState,
    reducers: {
        setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
            state.authUser = action.payload;
        },
        setActiveChat: (state, action: PayloadAction<ActiveChat>) => {
            state.activeChat = action.payload;
        },
        setPusherMessages: (state, action: PayloadAction<Message>) => {
            state.pusherMessages.push(action.payload);
        },
        setChats: (state, action: PayloadAction<ChatsType>) => {
            state.chats.push(action.payload);
        },
    },
});
export const { setActiveChat, setAuthUser, setChats, setPusherMessages } =
    chatSlicer.actions;
export default chatSlicer.reducer;
