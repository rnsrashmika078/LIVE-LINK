import { tool } from "ai";
import z from "zod/v3";
import { openChatTask } from "./agentTasks";
export const openChatTool = tool({
  description: "open a chat",
  inputSchema: z.object({
    chatId: z.string().describe("pick the chat id from the chat list"),
    replyMessage: z
      .string()
      .describe("Short human message like: Opening abc's chat"),
  }),
  execute: async ({ chatId, replyMessage }) => {
    return {
      title: "open-chat",
      chatId,
      replyMessage,
    };
  },
});
export const scheduleMessageTool = tool({
  description: "schedule a Message",
  inputSchema: z.object({
    time: z.coerce.date().describe("scheduled time"),
    scheduleMessage: z.string().describe("message content"),
    chatId: z.string().describe("pick chat id matching the given user name"),
    replyMessage: z
      .string()
      .describe("Short human message like about current message schedule task"),
  }),
  execute: async ({ chatId, replyMessage, time, scheduleMessage }) => {
    return {
      chatId,
      replyMessage,
      time,
      scheduleMessage,
    };
  },
});
