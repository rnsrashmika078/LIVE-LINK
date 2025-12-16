import connectDB from "@/app/backend/lib/connectDB";
import Message from "@/app/backend/models/Message";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary/cloudinary";
import Chat from "@/app/backend/models/Chat";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function DELETE(
  req: NextRequest,
  { params }: { params: { messageId: string; chatId: string } }
) {
  try {
    await connectDB();
    const { messageId, chatId } = await params;

    let public_id: string | undefined;
    try {
      const body = await req.json();
      public_id = body?.public_id;
    } catch (err) {
      public_id = undefined;
    }
    const message_structure = `
      {"url": "","message": "🚫This message was deleted","name": "","format": "","public_id": ""}`;

    await Promise.all([
      Message.updateOne(
        { customId: messageId },
        { content: message_structure }
      ),
      Chat.updateOne(
        { lastMessageId: messageId },
        {
          lastMessage: `${message_structure}`,
        }
      ),
      pusher.trigger(`private-message-${chatId}`, "client-message", {
        type: "deleting",
        messageId,
        chatId,
      }),
    ]);

    if (public_id) {
      await Promise.all([
        //delete file from cloudinary
        cloudinary.uploader.destroy(public_id ?? ""),

        //delete file from chat
        Chat.updateOne(
          { chatId },
          {
            $pull: { files: { public_id: public_id } },
          }
        ),
      ]);
    }

    return NextResponse.json({
      status: 200,
      success: true,
      message: "🚫This message was deleted",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 505,
      success: false,
      message: error instanceof Error ? error.message : "internal server error",
    });
  }
}
