import mongoose from "mongoose";
// import Message from "./Message";

const ChatSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    participants: [{ type: String }],
    lastMessage: {
      type: String,
      required: false,
    },
    lastMessageId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    files: [
      {
        public_id: {
          type: String,
          required: false,
        },
        format: {
          type: String,
          required: false,
        },
        url: {
          type: String,
          required: false,
        },
        name: {
          type: String,
          required: false,
        },
      },
    ],
    unreadCount: [
      {
        userId: { type: String },
        count: { type: Number },
      },
    ],
    lastMessageReadUsers: [{ type: String }],
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

export default Chat;
