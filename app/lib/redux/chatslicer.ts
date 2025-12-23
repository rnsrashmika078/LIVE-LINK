/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  ActiveUsersType,
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
  GroupMessageSeen: SeenType[];
  globalMessages: Message[];
  unreads: number;
  chats: ChatsType[] | GroupType[];
  typingUsers: TypingUser[];
  chatArray: ChatsType[];
  deletedMessage: DeletedMessage[];
  debouncedText: string;
  groupChats: GroupType[];
  activeUsers: ActiveUsersType[];
};
const initialState: ReduxChatState = {
  activeChat: null,
  authUser: null,
  messages: null,
  chats: [],
  globalMessages: [],
  unreads: 0,
  chatArray: [],
  groupChats: [],
  typingUsers: [],
  messageSeen: { state: "", chatId: "", receiverId: "", senderId: "" },
  messagesArray: [],
  debouncedText: "",
  deletedMessage: [],
  GroupMessageSeen: [],
  activeUsers: [],
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
    setGroupMessageSeen: (state, action: PayloadAction<SeenType | null>) => {
      if (action.payload) {
        state.GroupMessageSeen.push(action.payload!);
      }
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
      const { userId, chatId, isTyping } = action.payload;

      const user = state.typingUsers.find((u) => u.userId === userId);

      if (user) {
        user.isTyping = isTyping;
        user.chatId = chatId;
        if (!isTyping) {
          state.typingUsers = state.typingUsers.filter(
            (u) => !(u.userId === userId && u.chatId === chatId)
          );
        }
      } else {
        state.typingUsers.push(action.payload);
      }
    },
    connectUser: (state, action: PayloadAction<ActiveUsersType>) => {
      const exist = state.activeUsers.some(
        (a) => a.userId === action.payload.userId
      );
      if (!exist) {
        state.activeUsers.push(action.payload);
      }
    },
    disconnectUser: (state, action: PayloadAction<ActiveUsersType>) => {
      const exist = state.activeUsers.some(
        (a) => a.userId === action.payload.userId
      );
      if (exist) {
        state.activeUsers = state.activeUsers.filter(
          (a) => a.userId !== action.payload.userId
        );
      }
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
    setGlobalMessages: (state, action: PayloadAction<Message | Message[]>) => {
      state.globalMessages = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
    },
  },
});
export const {
  setActiveChat,
  setAuthUser,
  setUnreads,
  setGlobalMessages,
  setChats,
  setMessageSeen,
  setMessages,
  setDeletedMessage,
  setMessagesArray,
  setChatsArray,
  setTypingUsers,
  setDebouncedText,
  setGroupChats,
  setGroupMessageSeen,
  connectUser,
  disconnectUser,
} = chatSlicer.actions;
export default chatSlicer.reducer;
