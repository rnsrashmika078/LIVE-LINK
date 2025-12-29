import { FileType, Message, MessageContentType, StatusType } from "../types";
import { handleAudioUpload, handleFileUpload } from "../util/util";

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
  try {
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
  } catch (err) {
    console.log(err);
  }
}
function renderMsgIcon(format: string) {
  if (
    format.includes("png") ||
    format.includes("jpeg") ||
    format.includes("jpg") ||
    format.includes("avif")
  ) {
    return "🖼️ Photo";
  }
  if (format.includes("mp4")) {
    return "▶️ Voice Message";
  }
  if (format.includes("webm")) {
    return "🎤 Voice Message";
  }
  if (format.includes("pdf")) {
    return "📑 Voice Message";
  }
}
export function modifiedMessage(input: MessageContentType): string | null {
  if (!input) return null;

  const { url, message, name, format } = input;

  if (url && message) {
    // if message and url there it only show the message as last message
    return message;
  }
  //if url only show the name of the file
  if (url) {
    return `${renderMsgIcon(format)}`;
  }
  return !message ? null : message;
}

export function modifiedMessageOnMessageArea(
  input: MessageContentType,
  to: "file" | "message" = "message"
): string | null {
  if (!input) return null;

  const { message, url } = input;

  if (to === "file" && url) {
    return url;
  }
  if (to === "message" && message) {
    return message;
  }
  return null;
}

export async function buildMessageStructure(
  file: File | Blob | null = null,
  inputMessage: string,
  sendMessage: (
    structure: MessageContentType,
    fileMeta: FileType | null
  ) => void,
  callBack: (file: File | Blob | null) => void,
  blobRef: React.RefObject<Blob | null>, // this just for cleanup
  feature?: boolean,
  prompt?: string
) {
  let fileMeta = null;
  let messageStructure = null;
  try {
    if (file || feature) {
      //if file is present or features ( such as ai image gen ) used upload the file first

      fileMeta =
        file instanceof File
          ? await handleFileUpload(file as File, feature, prompt)
          : await handleAudioUpload(file as Blob, feature, prompt);
      if (!fileMeta) return;
      blobRef.current = null;
      const { url, name, format, public_id } = fileMeta;

      messageStructure = {
        url: url,
        message: inputMessage,
        name: name,
        format: format,
        public_id: public_id,
      };
      sendMessage(messageStructure, fileMeta);
    } else {
      messageStructure = {
        url: "",
        message: inputMessage,
        name: "",
        format: "",
        public_id: "",
      };
      //if file or features ( such as ai image gen ) not use just send message
      sendMessage(messageStructure, fileMeta);
    }
  } finally {
    callBack(null);
  }
}
export function addDummyData(
  chatId: string,
  senderId: string,
  senderName: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  const messageStructure = {
    url: "/dummy.png",
    message: "",
    name: "",
    format: "png",
    public_id: "",
  };
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
  setFeatureActive: (state: boolean) => void,
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
export function onViewDestruct(onViewStatus: StatusType | null) {
  if (onViewStatus == null) return;

  let file: FileType | undefined;
  let statusId: string | undefined;
  let caption: string | undefined;
  let color: string | undefined;

  if (onViewStatus) {
    file = onViewStatus.content.file!;
    statusId = onViewStatus?.statusId ?? "";
    caption = onViewStatus?.content?.caption?.caption ?? "";
    color = onViewStatus?.content?.caption?.color ?? "";
  }

  return { file, statusId, caption, color };
}

export async function Agent(){
  
}
