"use client";
import { SeenByUserType, StatusType } from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ReduxChatState = {
  onViewStatus: StatusType | null;
  statusList: StatusType[];
  deletedStatusId: string | null;
  seenBy: SeenByUserType[];
};
const initialState: ReduxChatState = {
  onViewStatus: null,
  statusList: [],
  deletedStatusId: null,
  seenBy: [],
};
const statusSlicer = createSlice({
  name: "statusSlicer",
  initialState,
  reducers: {
    setOnViewStatus: (state, action: PayloadAction<StatusType | null>) => {
      state.onViewStatus = action.payload;
    },
    addNewStatus: (state, action: PayloadAction<StatusType>) => {
      const exist = state.statusList.some(
        (p) => p.statusId === action.payload.statusId
      );
      if (!exist) {
        state.statusList.push(action.payload);
      }
    },
    setDeleteStatus: (state, action: PayloadAction<string | null>) => {
      state.deletedStatusId = action.payload;
      state.statusList = state.statusList.filter(
        (s) => s.statusId !== action.payload
      );
    },
    setStatusSeenUser: (state, action: PayloadAction<SeenByUserType>) => {
      const exist = state.seenBy.some((s) => s.uid === action.payload.uid);
      if (!exist) {
        state.seenBy.push(action.payload);
      }
    },
    clearLiveSeen: (state) => {
      state.seenBy = [];
    },
  },
});
export const {
  setOnViewStatus,
  addNewStatus,
  setDeleteStatus,
  setStatusSeenUser,
  clearLiveSeen
} = statusSlicer.actions;
export default statusSlicer.reducer;
