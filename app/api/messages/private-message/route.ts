import connectDB from "@/app/backend/lib/connectDB";
import Chat from "@/app/backend/models/Chat";
import Message from "@/app/backend/models/Message";
import { NextResponse } from "next/server";
import Pusher from "pusher";

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
      files,
      unreads,
    } = await req.json();
    const existChat = await Chat.findOne({ chatId });
    if (existChat) {
      await pusher.trigger(`private-message-${chatId}`, "client-message", {
        chatId,
        senderId,
        receiverId,
        content,
        createdAt,
        status,
      });
      await Chat.findOneAndUpdate(
        { chatId },
        {
          lastMessage: content,
          status,
          senderId,
          createdAt,
          unreadCount: unreads,
          $push: {
            files,
          },
        }
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
      files,
      senderId,
      receiverId,
      createdAt,
      unreadCount: unreads,
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
