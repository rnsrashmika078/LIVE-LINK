import { BiArchive, BiMessage, BiPhoneCall, BiUser } from "react-icons/bi";
import { FaMessage, FaRegCircleDot, FaUsers } from "react-icons/fa6";
import { SlSettings } from "react-icons/sl";
import { TbTagStarred } from "react-icons/tb";
import {
  IoCheckmark,
  IoCheckmarkDone,
  IoCheckmarkDoneSharp,
} from "react-icons/io5";

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
