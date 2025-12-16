"use client";

import { configureStore } from "@reduxjs/toolkit";
import chatSlicer from "./chatslicer";
import layoutSlicer from "./layoutSlicer";
import notificationSlicer from "./notificationSlicer";
import friendsSlicer from "./friendsSlicer";
import sessionSlicer from "./sessionSlicer";

export const store = configureStore({
  reducer: {
    chat: chatSlicer,
    session: sessionSlicer,
    notify: notificationSlicer,
    friends: friendsSlicer,
    layout: layoutSlicer,
  },
});
