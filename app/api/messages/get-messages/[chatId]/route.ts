import Message from "@/app/backend/models/Message";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = await params;
    if (!chatId) {
      return NextResponse.json({
        status: 404,
        message: "chat id not found!",
      });
    }
    const allMessages = await Message.find({ chatId });

    if (allMessages && allMessages.length > 0) {
      return NextResponse.json({
        history: allMessages,
        status: 200,
        message: "getting messages succeed!",
      });
    }
    return NextResponse.json({
      message: "no messages",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error,
    });
  }
}
