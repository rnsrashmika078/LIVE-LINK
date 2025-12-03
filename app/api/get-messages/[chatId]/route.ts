import Message from "@/app/backend/models/Message";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = await params;

    const allMessages = await Message.find({ chatId });

    if (allMessages && allMessages.length > 0) {
      return NextResponse.json({
        history: allMessages,
        message: "getting messages succeed!",
      });
    }
    return NextResponse.json({
      history: [],
      message: "no messages",
    });
  } catch (error) {
    return NextResponse.json({
      message: error,
    });
  }
}
