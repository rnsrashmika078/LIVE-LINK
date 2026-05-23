
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NotificationType = {
  notify: string;
  id: string;
};

const initialState: NotificationType = {
  notify: "",
  id: "",
};

const notificationSlicer = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<NotificationType>) => {
      state.notify = action.payload.notify;
      state.id = action.payload.id;
    },
  },
});
export const { setNotification } = notificationSlicer.actions;

export default notificationSlicer.reducer;
