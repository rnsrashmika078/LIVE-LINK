/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const {
      customId,
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

    const pusherMessagePayload = {
      chatId,
      customId,
      senderId,
      receiverId,
      content,
      createdAt,
      status,
    };

    const newMessagePayload = {
      customId,
      chatId,
      content,
      receiverId,
      status,
      senderId,
    };
    const newChatPayload = {
      chatId,
      lastMessage: content,
      lastMessageId: customId,
      unreadCount: [],
      participants: [],
      name,
      senderId,
      dp,
      createdAt,
      status,
      type: "create_initial_chat",
      message: "You have New Message",
    };

    await pusher.trigger(
      `private-message-${chatId}`,
      "client-message",
      pusherMessagePayload
    );
    const [_, existChat] = await Promise.all([
      connectDB(),
      Chat.findOne({ chatId }).lean(),
    ]);

    if (existChat) {
      let updateData: any = {
        lastMessage: content,
        lastMessageId: customId,
        status,
        senderId,
        createdAt,
        unreadCount: unreads,
      };

      if (files?.url) {
        updateData = { ...updateData, files };
      }

      await Promise.all([
        Chat.findOneAndUpdate({ chatId }, updateData),
        Message.create(newMessagePayload),
      ]);
      return NextResponse.json({
        status: 200,
        message: content,
        success: true,
      });
    }
    let updateData: any = {
      chatId: chatId,
      lastMessageId: customId,
      participants: [senderId, receiverId],
      lastMessage: content,
      status,
      senderId,
      receiverId,
      createdAt,
      unreadCount: unreads,
    };

    if (files?.url) {
      updateData = { ...updateData, files };
    }
    await Promise.all([
      // this send to the other end user for the first time of the chat creation
      pusher.trigger(`private-notify-${receiverId}`, "notify", newChatPayload),
      Chat.create(updateData),
      Message.create(newMessagePayload),
    ]);

    return NextResponse.json({ status: 200, message: content, success: true });
  } catch (error) {
    console.error("Error in /api/message:", error);
    return NextResponse.json(
      { error: "Server error", message: "no message while error" },
      { status: 500 }
    );
  }
}
