import connectDB from "@/app/backend/lib/connectDB";
import Group from "@/app/backend/models/Group";
import GroupMessage from "@/app/backend/models/GroupMessage";
import { NextRequest, NextResponse } from "next/server";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const payload = await req.json();

    const files = payload.files;
    const chatId = payload.chatId;
    const lastMessage = payload.content;

    const lastMessagePayload = {
      message: lastMessage,
      name: payload.senderInfo.senderName,
    };

    await pusher.trigger(
      `private-message-${chatId}`,
      "client-message",
      payload
    );
    await Promise.all([
      GroupMessage.create(payload),
      Group.findOneAndUpdate(
        { chatId },
        {
          $set: {
            files,
            lastMessage: lastMessagePayload,
            seenBy: payload.seenBy,
            unreads: payload.unreads,
          },
        }
      ),
    ]);
    return NextResponse.json({
      success: true,
      message: "Message save in db successfully!",
      status: 202,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: err,
      status: 505,
    });
  }
}
