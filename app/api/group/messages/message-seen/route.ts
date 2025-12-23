import connectDB from "@/app/backend/lib/connectDB";
import Group from "@/app/backend/models/Group";
import GroupMessage from "@/app/backend/models/GroupMessage";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { chatId, receiverId, senderId, seenStat } = await req.json();

    if (!chatId) {
      return NextResponse.json({
        success: false,
        message: "chatId is undefined!",
      });
    }
    if (seenStat === "seen") {
      await GroupMessage.updateMany(
        {
          chatId,
        },
        { status: "seen" }
      );
    }
    await Promise.all([
      GroupMessage.updateMany(
        {
          chatId,
          "seenBy.userId": receiverId,
          senderId: { $ne: senderId },
        },
        { $set: { "seenBy.$.status": "seen" } }
      ),
      Group.findOneAndUpdate(
        {
          chatId,
          "unreads.userId": receiverId,
          senderId: { $ne: senderId },
        },
        { $set: { "unreads.$.count": 0 } }
      ),
    ]);

    return NextResponse.json({
      success: true,
      message: "You have seen all messages",
    });
  } catch (error) {
    console.log(error);
  }
}
