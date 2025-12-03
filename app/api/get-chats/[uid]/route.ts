import connectDB from "@/app/backend/lib/connectDB";
import Chat from "@/app/backend/models/Chat";
import User from "@/app/backend/models/User";
import { ChatsType } from "@/app/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    await connectDB();

    const { uid } = await params;

    const chats = await Chat.find({ participants: { $in: [uid] } }).select(
      "participants lastMessage unreadCount chatId"
    );

    const chatList = [];

    for (const ch of chats) {
      const otherUserId = ch.participants.find((p: string) => p !== uid);

      const otherUser = await User.findOne({ uid: otherUserId }).select(
        "uid name email dp"
      );

      chatList.push({
        uid: otherUser?.uid,
        name: otherUser?.name,
        chatId: ch?.chatId,
        email: otherUser?.email,
        dp: otherUser?.dp,
        lastMessage: ch.lastMessage,
        unreadCount: ch.unreadCount,
      });
    }

    return Response.json({
      message: "Successfully getting chats!",
      chats: chatList,
      status: 200,
    });
  } catch (error) {
    return Response.json({ error: "Server error" + error }, { status: 500 });
  }
}
