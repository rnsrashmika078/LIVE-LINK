import {
  BiArchive,
  BiEdit,
  BiMessage,
  BiPhoneCall,
  BiSearch,
  BiUser,
} from "react-icons/bi";
import { FaRegCircleDot, FaUsers } from "react-icons/fa6";
import { SlSettings } from "react-icons/sl";
import { TbTagStarred } from "react-icons/tb";
import {
  IoCheckmark,
  IoCheckmarkDone,
  IoCheckmarkDoneSharp,
} from "react-icons/io5";
import { Agent, ChatsType, IconArrayType } from "../types";

//side bar items array
export const StartItems = [
  {
    name: "chats",
    icon: BiMessage,
  },
  {
    name: "calls",
    icon: BiPhoneCall,
  },
  {
    name: "status",
    icon: FaRegCircleDot,
  },
  {
    name: "connections",
    icon: FaUsers,
  },
];
export const MiddleItems = [
  {
    name: "starred",
    icon: TbTagStarred,
  },
  {
    name: "archive",
    icon: BiArchive,
  },
];
export const EndItems = [
  {
    name: "settings",
    icon: SlSettings,
  },
  {
    name: "users",
    icon: BiUser,
  },
];

export const messageStatus = {
  seen: IoCheckmarkDoneSharp,
  delivered: IoCheckmarkDone,
  sent: IoCheckmark,
};

export const actionMenuItem = [
  "Info",
  "Reply",
  "Copy",
  "Forward",
  "Delete",
  "Report",
];
export const chatListIcons: IconArrayType = [
  { name: "edit", icon: BiEdit },
  // { name: "filter", icon: BiFilter },
];
export const MessagePanelIcons: IconArrayType = [
  { name: "audio", icon: BiPhoneCall },
  { name: "search", icon: BiSearch },
];
export const loadingStates: string[] = [
  "Loading Model...",
  "Analyzing User Prompt...",
  "Fetching Data...",
  "Processing Request...",
  "Generating Response...",
  "Optimizing Output...",
  "Checking Dependencies...",
  "Validating Input...",
  "Connecting to Server...",
  "Encrypting Data...",
  "Scanning for Errors...",
  "Applying AI Logic...",
  "Formatting Response...",
  "Finalizing Result...",
  "Ready to Display...",
];

export const NewChatModalItem = [
  {
    image: "/group_avatar.png",
    title: "Create Group",
  },
  {
    image: "/add_friend_avatar.png",
    title: "Add Friend",
  },
];
export const EmojiList = ["❤️", "👍", "😂", "😢", "😮", "😡", "🎉"];

export const agent: Agent = {
  name: "Live Link Agent",
  dp: "/agent4.png",
  updatedAt: new Date().toISOString(),
  unreadCount: [],
  type: "Agent",
  chatId: "ll-agent-v2",
  senderId: "",
  status: "seen",
};

export const refinePrompt = `
You are an AI chatbot for a chat application.

STRICT OUTPUT RULES:
- Reply ONLY to the user's query, concisely and clearly.
- NO reasoning, explanations, or extra text.
- NEVER return empty response.
- Output exactly ONE line of VALID JSON, no code blocks.

JSON FORMAT:
{
  "title": "<short descriptive title>",
  "answer": "<full reply in Markdown>",
  "function": {
    "title": "<\"open-chat\" or \"scheduler\">",
    "chatId": "<ID from chatList matching user intent>",
    "message": "<only for scheduler>",
    "time": "<only for scheduler, JS Date format>"
  }
}

CONDITIONAL FUNCTION:
- Include "function" ONLY if user requests action:
  e.g., "open chat", "switch chat", "schedule message".
- Otherwise, omit "function".

CONSTRAINTS:
- "function" must be JSON, not string.
- Never invent or modify chatId.
- If scheduling, ask for message, time, and recipient if missing.

MARKDOWN RULES:
- Preserve valid Markdown in "answer".
- Escape quotes to remain valid JSON.
`;
