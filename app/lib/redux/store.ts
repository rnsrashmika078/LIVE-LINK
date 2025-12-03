"use client";

import { configureStore } from "@reduxjs/toolkit";
import chatSlicer from "./chatslicer";
import layoutSlicer from "./layoutSlicer";
import notificationSlicer from "./notificationSlicer";
import friendsSlicer from "./friendsSlicer";

export const store = configureStore({
  reducer: {
    chat: chatSlicer,
    notify: notificationSlicer,
    friends: friendsSlicer,
    layout: layoutSlicer,
  },
});
