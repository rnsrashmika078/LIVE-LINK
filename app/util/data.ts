import {
  BiArchive,
  BiEdit,
  BiFilter,
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
import { IconArrayType } from "../types";

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
