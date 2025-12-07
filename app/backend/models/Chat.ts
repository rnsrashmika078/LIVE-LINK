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
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
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
