/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AuthUser,
  MessageContentType,
  OpenChatType,
  ScheduleMessageType,
} from "../types";
import { v4 as uuidv4 } from "uuid";

//AT stands for Agent Task
export const ScheduleMessageTask = async (
  data: ScheduleMessageType,
  authUser: AuthUser | null,
  scheduleActivate: boolean,
  presence: "Online" | "Offline",
  callback: (payload: any) => void
) => {
  const messagePayload: MessageContentType = {
    url: "",
    format: "",
    message: data?.scheduleMessage,
    name: "",
    public_id: "",
  };
  const dateObj = new Date(data?.time);
  let iso;
  if (dateObj !== null) {
    iso = dateObj.toISOString();
  }

  const customId = uuidv4();
  const name = authUser?.name ?? "";
  const senderId = authUser?.uid ?? "";
  const receiverId = data?.chatId;

  try {
    const payload = {
      customId,
      content: messagePayload,
      files: null,
      senderId,
      receiverId,
      chatId: data?.chatId,
      type: "Individual",
      name,
      scheduleTime: scheduleActivate ? iso : null,
      isSchedule: scheduleActivate,
      dp: authUser?.dp ?? "",
      createdAt: iso,
      status: presence === "Online" ? "delivered" : "sent",
      unreads: [
        {
          userId: data?.chatId,
          count: 0,
        },
      ],
    };
    callback(payload);
    // mutate({ message: payload });
  } catch (err) {
    console.error("Invalid JSON:", err);
  }

  //   dispatch(setUnreads(unreads + 1));
};

export const openChatTask = (
  data: OpenChatType,
  chatRefs: React.RefObject<Record<string, HTMLDivElement | null>>
) => {
  if (data?.title?.includes("open-chat")) {
    chatRefs.current[data.chatId]?.click();
  }
};
