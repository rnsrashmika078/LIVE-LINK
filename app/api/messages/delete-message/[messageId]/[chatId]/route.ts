import connectDB from "@/app/backend/lib/connectDB";
import Message from "@/app/backend/models/Message";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary/cloudinary";
import Chat from "@/app/backend/models/Chat";
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

    console.log("asset Id", public_id);
    console.log("messageId Id", messageId);
    console.log("chatId Id", chatId);
    //delete message
    await Message.deleteOne({ customId: messageId });

    //delete file from chat
    await Chat.updateOne(
      { chatId },
      { $pull: { files: { public_id: public_id } } }
    );

    if (public_id) {
      await cloudinary.uploader.destroy(public_id ?? "");
    }
    //delete file from cloudinary

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Successfully delete the message",
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
