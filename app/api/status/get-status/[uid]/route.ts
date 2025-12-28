import Status from "@/app/backend/models/Status";
import User from "@/app/backend/models/User";
import { StatusType } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const { uid } = await params;
    if (!uid) {
      return NextResponse.json(
        { success: false, message: "User ID not found!" },
        { status: 404 }
      );
    }
    const friendsData = await User.find({ uid }).select("friends -_id").lean();
    const friendUids = friendsData[0]?.friends || [];

    const allStatus = await Status.find({
      uid: { $in: [...friendUids, uid] },
    }).lean();

    return NextResponse.json(
      {
        success: true,
        allStatus,
        message: "Successfully received status",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
