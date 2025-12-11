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
    const friendsArray = await User.findOne({ uid }).select("friends");

    const friends = await User.find({
      uid: { $in: friendsArray?.friends || [] },
    }).select("uid name email dp");

    if (friends?.length === 0) {
      return NextResponse.json({
        success: true,
        status: 200,
        friends: [],
        message: "error while receiving friend list!",
      });
    }

    return Response.json({
      success: true,
      status: 200,
      friends: friends,
      message: "receiving friend list!",
    });
  } catch (error) {
    return Response.json({ error: "Server error" + error }, { status: 500 });
  }
}
