import { AuthUser, FileType, Message, PreviewDataType } from "../types";
import { handleImageUpload } from "../util/util";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function apiFetch(
  route: string,
  method: "GET" | "POST" | "DELETE" | "PUT",
  body?: any,
  routeType: "NATIVE" | "EXTERNAL" = "NATIVE",
  cache:
    | "no-store"
    | "force-cache"
    | "no-cache"
    | "default"
    | "only-if-cached"
    | "reload" = "no-store"
) {
  let res;
  if (routeType === "EXTERNAL") {
    res = await fetch(`${route}`, {
      method,
      cache,
      body,
    });
  } else {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${route}`, {
      method,
      cache,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  return res;
}

export function modifiedMessage(input: string): string | null {
  if (!input) return null;
  let msg;
  try {
    const parsedMessage =
      typeof input === "string" ? JSON?.parse(input) : input;
    const { url, format, message, name } = parsedMessage;

    if (url && message) {
      msg = message;
    } else if (url) {
      msg = name + "." + format;
    } else {
      msg = message;
    }
  } catch (err) {
    console.log(err);
  }

  return msg;
}

export function modifiedMessageOnMessageArea(
  input: string,
  to: "file" | "message" = "message"
): string | null {
  if (!input) return null;

  const { message, url } = JSON.parse(input);

  if (to === "file" && url) {
    return url;
  }
  if (to === "message" && message) {
    return message;
  }
  return null;
}
export function elapsedTime(startedAt: number) {
  const time = new Date();
  return time;
}
export async function buildMessageStructure(
  file: File | null = null,
  inputMessage: string,
  sendMessage: (structure: string, fileMeta: FileType | null) => void,
  fileState: (file: File | null) => void,
  feature?: boolean,
  prompt?: string
) {
  let fileMeta = null;
  let messageStructure = null;
  try {
    if (file || feature) {
      //if file is present or features ( such as ai image gen ) used upload the file first
      fileMeta = await handleImageUpload(file, feature, prompt);
      if (!fileMeta) return;
      const { url, name, format, public_id } = fileMeta;

      messageStructure = `{"url": "${url}", "message" : "${inputMessage}" ,"name" : "${name}" , "format" : "${format}", "public_id" : "${public_id}"}`;
      sendMessage(messageStructure, fileMeta);
    } else {
      //if file or features ( such as ai image gen ) not use just send message
      messageStructure = `{"url": "", "message" : "${inputMessage}" ,"name" : "" , "format" : "", "public_id" : ""}`;
      sendMessage(messageStructure, fileMeta);
    }
  } finally {
    fileState(null);
    fileState(null);
  }
}
export function addDummyData(
  chatId: string,
  senderId: string,
  senderName: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  const messageStructure = `{"url": "/dummy.png", "message" : "" ,"name" : "" , "format" : "png", "public_id" : ""}`; // this change in the future to JSON Format
  const createdAt = new Date().toISOString();
  const customId = "dummy_001";
  const payload = {
    customId,
    chatId,
    senderInfo: {
      senderId,
      senderName,
    },
    unreads: [],
    content: messageStructure,
    files: null,
    seenBy: [],
    createdAt,
  };
  setMessages((prev) => [...prev, payload]);
}
export function activateFeature(
  state: boolean,
  setFeatureActive: React.Dispatch<React.SetStateAction<boolean>>,
  setInput: React.Dispatch<React.SetStateAction<string>>
) {
  setFeatureActive(state);
  setInput((prev) => prev + "LIVELINK: ");
}

export function featureActivation(debounce: string): boolean {
  if (debounce && debounce.length > 0) {
    const text = "@LIVELINK:";
    if (text.toLowerCase().startsWith(debounce.toLowerCase())) {
      return true;
    }
    return false;
  }
  return false;
}
