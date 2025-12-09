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
    const { chatId, receiverId, senderId } = await req.json();

    await pusher.trigger(`private-message-seen-${chatId}`, "message-seen", {
      chatId,
      receiverId,
      senderId,
    });
    if (!chatId) {
      return NextResponse.json({
        success: false,
        message: "chatId is undefined!",
      });
    }

    await Message.updateMany(
      { chatId, receiverId: receiverId, status: { $ne: "seen" } },
      { $set: { status: "seen" } }
    );
    await Chat.updateOne({ chatId }, { status: "seen", unreadCount: [] });

    return NextResponse.json({
      success: true,
      message: "You have seen all messages",
    });
  } catch (error) {
    console.log(error);
  }
}
