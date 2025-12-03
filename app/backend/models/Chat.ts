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
    // messages: [Message],
    unreadCount: [
      {
        userId: { type: String },
        count: { type: Number },
      },
    ],
    // status: {
    //     type: String,
    //     enum: ["sent", "delivered", "seen"],
    //     default: "sent",
    // },
  },
  { timestamps: true }
);

const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

export default Chat;
