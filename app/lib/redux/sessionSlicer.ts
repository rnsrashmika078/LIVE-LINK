"use client";
import { SessionInfoSerialize } from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ReduxChatState = {
  sessionInfo: SessionInfoSerialize | null;
};
const initialState: ReduxChatState = {
  sessionInfo: null,
};
const sessionSlicer = createSlice({
  name: "sessionSlicer",
  initialState,
  reducers: {
    setSessionInfo: (state, action: PayloadAction<SessionInfoSerialize | null>) => {
      state.sessionInfo = action.payload;
    },
  },
});
export const { setSessionInfo } = sessionSlicer.actions;
export default sessionSlicer.reducer;
