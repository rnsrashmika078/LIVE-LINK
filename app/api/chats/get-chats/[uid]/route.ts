import connectDB from "@/app/backend/lib/connectDB";
import Chat from "@/app/backend/models/Chat";
import User from "@/app/backend/models/User";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    await connectDB();
    const { uid } = await params;

    const chats = await Chat.find({ participants: { $in: [uid] } }).lean();
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
        createdAt: ch.createdAt,
        updatedAt: ch.updatedAt,
        status: ch.status,
        senderId: ch.senderId,
        receiverId: ch.receiverId,
        lastMessageId: ch.lastMessageId,
        type: ch.type,
      });
    }
    if (chatList.length > 0) {
      return Response.json({
        message: "Successfully getting chats!",
        chats: chatList,
        status: 200,
      });
    }

    return Response.json({
      message: "Successfully getting chats!",
      chats: [],
      status: 200,
    });
  } catch (error) {
    return Response.json({ error: "Server error" + error }, { status: 500 });
  }
}
