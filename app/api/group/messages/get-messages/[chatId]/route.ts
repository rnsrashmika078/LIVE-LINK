import connectDB from "@/app/backend/lib/connectDB";
import GroupMessage from "@/app/backend/models/GroupMessage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    await connectDB();
    const { chatId } = await params;

    const chatMessages = await GroupMessage.find({ chatId });

    return NextResponse.json({
      success: true,
      chatMessages,
      message: "Message save in db successfully!",
      status: 200,
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
