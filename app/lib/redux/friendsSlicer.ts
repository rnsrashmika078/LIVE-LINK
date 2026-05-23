"use client";
import { AuthUser } from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ReduxChatState = {
  friendRequest: AuthUser | null;
  friends: AuthUser[];
  OnlineUsers: string[];
  joinedUsers: string | null;
  leftUsers: string | null;
};
const initialState: ReduxChatState = {
  friendRequest: null,
  friends: [],
  OnlineUsers: [],
  joinedUsers: null,
  leftUsers: null,
};

const friendsSlicer = createSlice({
  name: "friendsSlicer",
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<AuthUser>) => {
      const exist = state.friends.some((f) => f.uid === action.payload.uid);
      if (!exist) {
        state.friends.push(action.payload);
      }
    },
    setFriendRequest: (state, action: PayloadAction<AuthUser | null>) => {
      state.friendRequest = action.payload;
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.OnlineUsers = action.payload;
    },
    setJoinedUser: (state, action: PayloadAction<string>) => {
      const exist = state.OnlineUsers.some((u) => u === action.payload);
      if (!exist) {
        state.OnlineUsers.push(action.payload);
      }
    },

    setLeftUser: (state, action: PayloadAction<string>) => {
      const exist = state.OnlineUsers.some((u) => u === action.payload);
      if (exist) {
        state.OnlineUsers = state.OnlineUsers.filter(
          (u) => u !== action.payload
        );
      }
    },
  },
});
export const {
  setFriendRequest,
  setFriends,
  setOnlineUsers,
  setJoinedUser,
  setLeftUser,
} = friendsSlicer.actions;

export default friendsSlicer.reducer;
