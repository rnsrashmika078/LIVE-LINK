import connectDB from "@/app/backend/lib/connectDB";
import User from "@/app/backend/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    await connectDB();
    const { uid } = await params;

    const lastSeen = await User.findOne({ uid }).select("lastSeen");

    if (!lastSeen) {
      return NextResponse.json({
        message: "unable to retrieve the last seen updates",
        success: false,
      });
    }
    return NextResponse.json({
      message: "Successfully retrieve Last seen updates!",
      success: true,
      lastSeen: lastSeen?.lastSeen,
    });
  } catch (error) {
    console.log(error);
  }
}
