import connectDB from "@/app/backend/lib/connectDB";
import Chat from "@/app/backend/models/Chat";
import Message from "@/app/backend/models/Message";
import { NextResponse } from "next/server";
import Pusher from "pusher";
// import Message from "@/src/server_side/backend/models/Message";
// import Conversation from "@/src/server_side/backend/models/Conversation";
// import connectDB from "@/src/server_side/backend/lib/connectDB";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const {
      chatId,
      content,
      senderId,
      receiverId,
      dp,
      name,
      createdAt,
      status,
    } = await req.json();
    const existChat = await Chat.findOne({ chatId });
    if (existChat) {
      await pusher.trigger(`private-message-${chatId}`, "message", {
        chatId,
        senderId,
        receiverId,
        content,
        createdAt,
        status,
      });
      await Chat.findOneAndUpdate(
        { chatId },
        { lastMessage: content, status, senderId, createdAt }
      );
      const latestMessage = new Message({
        chatId,
        content,
        receiverId,
        status,
        senderId,
      });

      await latestMessage.save();
      return NextResponse.json({
        status: "ok",
        message: content,
        success: true,
      });
    }

    await pusher.trigger(`private-message-${chatId}`, "message", {
      chatId,
      senderId,
      receiverId,
      content,
      status,
    });
    await pusher.trigger(`private-notify-${receiverId}`, "notify", {
      chatId,
      lastMessage: content,
      unreadCount: [],
      participants: [],
      name,
      senderId,
      dp,
      createdAt,
      status,
      type: "create_initial_chat",
      message: "You have New Message",
    });

    const newChat = new Chat({
      chatId: chatId,
      participants: [senderId, receiverId],
      lastMessage: content,
      status,
      senderId,
      createdAt,
      unreadCount: [
        { userId: senderId, count: 0 },
        { userId: receiverId, count: 0 },
      ],
    });
    const newMessage = new Message({
      chatId,
      content,
      receiverId,
      status,
      senderId,
    });

    await newChat.save();
    await newMessage.save();

    return NextResponse.json({ status: "ok", message: content, success: true });
  } catch (error) {
    console.error("Error in /api/message:", error);
    return NextResponse.json(
      { error: "Server error", message: "no message while error" },
      { status: 500 }
    );
  }
}
