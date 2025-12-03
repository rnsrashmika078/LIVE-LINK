"use client";
import { AuthUser } from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ReduxChatState = {
  friendRequest: AuthUser | null;
  friends: AuthUser[];
  OnlineUsers: AuthUser[];
  joinedUsers: AuthUser | null;
  leftUsers: AuthUser | null;
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
      state.friends.push(action.payload);
    },
    setFriendRequest: (state, action: PayloadAction<AuthUser | null>) => {
      state.friendRequest = action.payload;
    },
    setOnlineUsers: (state, action: PayloadAction<AuthUser[]>) => {
      state.OnlineUsers = action.payload;
    },
    setJoinedUser: (state, action: PayloadAction<AuthUser>) => {
      const exist = state.OnlineUsers.some((u) => u.uid === action.payload.uid);
      if (!exist) {
        state.OnlineUsers.push(action.payload);
      }
    },
    setLeftUser: (state, action: PayloadAction<AuthUser>) => {
      const exist = state.OnlineUsers.some((u) => u.uid === action.payload.uid);
      if (exist) {
        state.OnlineUsers = state.OnlineUsers.filter(
          (u) => u.uid !== action.payload.uid
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
