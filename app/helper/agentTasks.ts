/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthUser, MessageContentType } from "../types";
import { v4 as uuidv4 } from "uuid";

//AT stands for Agent Task
export const ScheduleMessageAT = async (
  message: string,
  authUser: AuthUser | null,
  chatId: string,
  scheduleActivate: boolean,
  time: Date,
  presence: "Online" | "Offline",
  callback: (payload: any) => void
) => {
  const messagePayload: MessageContentType = {
    url: "",
    format: "",
    message,
    name: "",
    public_id: "",
  };
  const date = new Date();
  const customId = uuidv4();
  const name = authUser?.name ?? "";
  const senderId = authUser?.uid ?? "";
  const receiverId = chatId;

  try {
    const payload = {
      customId,
      content: messagePayload,
      files: null,
      senderId,
      receiverId,
      chatId: chatId,
      type: "Individual",
      name,
      scheduleTime: scheduleActivate ? time : null,
      isSchedule: scheduleActivate,
      dp: authUser?.dp ?? "",
      createdAt: date.toISOString(),
      status: presence === "Online" ? "delivered" : "sent",
      unreads: [
        {
          userId: chatId,
          count: 0,
        },
      ],
    };
    callback(payload);
    // mutate({ message: payload });
  } catch (err) {
    console.error("Invalid JSON:", message, err);
  }

  //   dispatch(setUnreads(unreads + 1));
};
