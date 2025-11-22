"use client";

import { configureStore } from "@reduxjs/toolkit";
import chatSlicer from "./chatslicer";
import layoutSlicer from "./layoutSlicer";
export const store = configureStore({
    reducer: {
        chat: chatSlicer,
        layout: layoutSlicer,
    },
});
