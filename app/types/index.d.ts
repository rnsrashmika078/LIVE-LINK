/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from "socket.io-client";
import { store } from "../lib/redux/store";
import { IconType } from "react-icons/lib";

//app types
//communication types
export type SessionInfo = {
  callType?: "audio" | "video";
  callId?: string | null;
  callFrom?: string | null;
  callTo?: string | null;
  callerName?: string | null;
  callerDp?: string | null;
  calleeName?: string | null;
  calleeDp?: string | null;
  callStatus?: "Connecting.." | "Connected" | "Call End";
  callEndBy?: string | null;
  sdp?: RTCSessionDescriptionInit | null;
  candidate?: RTCIceCandidateInit | null;
  localAudioRef?: React.RefObject<HTMLAudioElement | null>;
  pendingCandidatesRef?: React.RefObject<RTCIceCandidateInit[]>;
  remoteAudioRef?: React.RefObject<HTMLAudioElement | null>;
  pcRef?: React.RefObject<RTCPeerConnection | null>;
  socket?: Socket | null;
};
export type SessionInfoSerialize = {
  callType?: "audio" | "video";
  callId?: string | null;
  callFrom?: string | null;
  callTo?: string | null;
  callerName?: string | null;
  callerDp?: string | null;
  calleeName?: string | null;
  calleeDp?: string | null;
  callStatus?: string | null;
  callEndBy?: string | null;
};
// export type CommunicationRefs = {
//   localAudioRef: React.RefObject<HTMLAudioElement | null>;
//   remoteAudioRef: React.RefObject<HTMLAudioElement | null>;
//   pcRef: React.RefObject<RTCPeerConnection | null>;
//   channelRef: React.RefObject<any>;
// };

export type IconArrayType = {
  name: string;
  icon: IconType;
}[];
export type RelativePositionType = {
  top: number;
  left: number;
};
export type DeletedMessage = {
  type?: string;
  messageId: string;
  chatId: string;
};
export type FileType = {
  format: string;
  url: string;
  name: string;
  public_id: string;
};
export type PreviewDataType = {
  file?: File | null;
  url: string;
  type: string;
  name: string;
};
export type SeenType = {
  state?: string;
  receiverId: string;
  senderId: string;
  chatId: string;
};
export type TypingUser = {
  userId: string;
  chatId: string;
  userName: string;
  isTyping: boolean;
  type: string;
};
export type AuthUser = {
  _id?: string;
  uid: string;
  email: string;
  dp: string;
  name: string;
  message?: string;
  type?: string;
  createdAt?: string;
  useFor?: string;
};
export type CaptionType = {
  caption?: string;
  color?: string;
};
export type StatusContent = {
  file: FileType | null;
  caption?: CaptionType;
};
export type SeenByUserType = {
  dp: string;
  name: string;
  uid: string;
  uidO?: string;
  createdAt?: string;
  statusId?: string;
};
export type StatusType = {
  id?: string;
  statusId: string;
  uid: string;
  email?: string;
  dp: string;
  name: string;
  content: StatusContent;
  createdAt?: string;
  seenBy?: SeenByUserType[];
  myFriends?: string[];
};

export type MessagePayload = {
  content: MessageContentType; //
  senderId: string; //
  customId: string; //
  receiverId: string; //
  chatId: string; //
  name: string; //
  dp: string; //
  createdAt: string; //
  status: string; //
  files?: FileType | null; //
  type?: string; //
  unreads?: Unread[]; //
};

export type Message = {
  customId: string;
  chatId: string;
  senderId?: string;
  senderName?: string;
  senderInfo?: SenderInfoType;
  receiverId?: string;
  content: MessageContentType;
  type?: string;
  userId?: string;
  isTyping?: boolean;
  seenBy?: SeenByType[];
  status?: "sent" | "delivered" | "seen";
  createdAt?: string;
  unreads?: Unread[];
};

export type Unread = {
  userId: string;
  count: number;
};
export type ChatsType = {
  _id?: string;
  chatId: string;
  uid: string;
  name: string;
  email: string;
  lastMessageId?: string;
  dp: string;
  lastMessage: MessageContentType;
  type?: string;
  senderId?: string;
  files?: FileType;
  receiverId?: string;
  message?: string;
  unreadCount?: Unread[];
  createdAt?: string;
  participants?: AuthUser[];
  updatedAt?: string;
  useFor?: string;
  status?: "sent" | "delivered" | "seen";
};

type ClickedMessageType = {
  id: string;
  message: Message | null;
};

// export type GroupMembers = {
//   userId: string;
//   firstName: string;
//   lastName: string;
// };

//group
export type GroupType = {
  chatId: string;
  groupName: string;
  createdBy: string;
  dp: string;
  lastMessage: LastMessageGroup;
  participants: ParticipantsType[];
  updatedAt?: string;
  createdAt?: string;
  senderInfo?: SenderInfoType;
  type?: string;
  message?: string;
  seenBy?: SeenByType[];
  unreads?: Unread[];
};

export type ActiveUsersType = {
  userName: authUser.name;
  userId: authUser.uid;
  chatId: group.chatId;
};

export type ParticipantsType = {
  userId: string;
  userName: string;
  userDp: string;
};
export type MessageContentType = {
  url: string;
  format: string;
  name: string;
  message: string;
  public_id: string;
};
export type LastMessageGroup = {
  message: MessageContentType;
  name: string;
};
export type SenderInfoType = {
  senderId: string;
  senderName: string;
};
export type SeenByType = {
  userId: string;
  userName: string;
  status: string;
  userDp: string;
};
export type GroupMessage = {
  customId: string;
  chatId: string;
  senderInfo: SenderInfoType;
  unreads: Unread[];
  content: MessageContentType;
  status: string;
  message?: string;
  seenBy?: SeenByType[];
  files?: FileType[] | null;
  createdAt?: string;
};

export type SectionType = {
  section: string;
};
//redux types
export type PusherChatState = ReturnType<typeof store.getState>;
export type PusherChatDispatch = typeof store.dispatch;
