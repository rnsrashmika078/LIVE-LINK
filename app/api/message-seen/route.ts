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
    console.log("receiverId", receiverId);
    console.log("senderId", senderId);

    if (!chatId) {
      return NextResponse.json({
        success: false,
        message: "chatId is undefined!",
      });
    }
    await pusher.trigger(`private-message-seen-${senderId}`, "message-seen", {
      chatId,
      receiverId: receiverId,
      senderId: senderId,
    });

    await Message.updateMany(
      { chatId, receiverId: senderId, status: { $ne: "seen" } },
      { $set: { status: "seen" } }
    );
    await Chat.updateOne(
      { chatId, status: { $ne: "seen" } },
      { status: "seen" }
    );

    // if (!updateMessage) {
    //   return NextResponse.json({
    //     success: false,
    //     message: "error while update many records!",
    //   });
    // }

    return NextResponse.json({
      success: true,
      message: "You have seen all messages",
    });
  } catch (error) {
    console.log(error);
  }
}
