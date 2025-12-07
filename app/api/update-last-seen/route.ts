import connectDB from "@/app/backend/lib/connectDB";
import User from "@/app/backend/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { uid, lastSeen } = await req.json();
    await connectDB();
    const update = await User.findOneAndUpdate({ uid }, { lastSeen });

    if (!update) {
      return NextResponse.json({
        message: "unable to update right now",
        success: false,
      });
    }
    return NextResponse.json({
      message: "Last seen was updated!",
      success: true,
      lastSeen,
    });
  } catch (error) {
    console.log(error);
  }
}
