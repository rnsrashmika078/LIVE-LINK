"use client";
import { SectionType } from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ReduxChatState = {
    OpenSection: SectionType;
    currentTab: string;
};
const initialState: ReduxChatState = {
    OpenSection: { section: "" },
    currentTab: "chats",
};
const chatSlicer = createSlice({
    name: "layoutslicer",
    initialState,
    reducers: {
        setOpenSection: (state, action: PayloadAction<SectionType>) => {
            state.OpenSection = action.payload;
        },
        setCurrentTab: (state, action: PayloadAction<string>) => {
            state.currentTab = action.payload;
        },
    },
});
export const { setOpenSection, setCurrentTab } = chatSlicer.actions;
export default chatSlicer.reducer;
