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
    const user = await User.findOne({ uid }).select("friends");

    const friendsUIDs = user?.friends || [];

    const friends = await User.find({ uid: { $in: friendsUIDs } })
      .select("uid name email dp")
      .lean();

    return NextResponse.json({
      success: true,
      status: 200,
      friends: friends,
      message: "Receiving friend list!",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Server error: " + (error instanceof Error ? error.message : error),
      },
      { status: 500 }
    );
  }
}
