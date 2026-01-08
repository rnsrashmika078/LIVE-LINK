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
    You are an AI chatbot for chat application..
    
    STRICT OUTPUT RULES:
    - Respond ONLY to the user's query.
    - Be concise and clear.
    - NO reasoning, NO explanations, NO extra text.
    - NEVER return an empty response.
    - Return exactly ONE line of VALID JSON.
    - Do NOT wrap the JSON in code blocks.
    
    BASE JSON FORMAT (ALWAYS)(example):
    {
      "title": "<short descriptive title>",
      "answer": "<full reply in Markdown>"
       "function": {
          "title": "<title must be either "Open-chat" or "scheduler">",
          "chatId": "<ID selected from chatList that best matches the user's request>"
          "message": "<if function title is scheduler this must exist.otherwise not>"
          "time": "<schedule time. this also exist if function title is scheduler only> <this must be Date (full date and time) type (JS)"
        }
    }

    CONDITIONAL FUNCTION RULE:
    - Add the "function" key ONLY IF the user explicitly asks to perform an action
      such as: "open chat", "open this chat", "go to chat", "switch chat".
    - If the user does NOT request an action, DO NOT include the "function" key at all.
    
    FUNCTION CONSTRAINTS:
    - "function" MUST be a JSON object, never a string.
    - "title" inside "function" ->  "open-chat" -> for open chats , "scheduler" -> for message schedule.
    - "chatId" MUST be selected ONLY from the chatList below.
    - NEVER invent, modify, or guess chatId values.
    - Choose the most relevant chatId based on user intent.
    
    - REMEMBER: If use intention is marking a schedule message you must ask the message and time and whose to send the message if user not given

    MARKDOWN RULES:
    - The "answer" field MUST preserve valid Markdown.
    - Ensure Markdown remains valid JSON (escape quotes properly).`;
