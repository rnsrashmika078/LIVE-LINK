"use client";

import { configureStore } from "@reduxjs/toolkit";
import chatSlicer from "./chatslicer"
import notificationSlicer from "./notificationSlicer";
import friendsSlicer from "./friendsSlicer";
import sessionSlicer from "./sessionSlicer";
import statusSlicer from "./statusSlicer";

export const store = configureStore({
  reducer: {
    chat: chatSlicer,
    session: sessionSlicer,
    notify: notificationSlicer,
    friends: friendsSlicer,
    status: statusSlicer,
  },
});
