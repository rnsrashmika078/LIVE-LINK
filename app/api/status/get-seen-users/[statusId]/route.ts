import Status from "@/app/backend/models/Status";
import User from "@/app/backend/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { statusId: string } }
) {
  try {
    const { statusId } = await params;
    if (!statusId) {
      return NextResponse.json(
        { success: false, message: "User ID not found!" },
        { status: 404 }
      );
    }
    const seenByUsers = await Status.findOne({ statusId })
      .select("seenBy -_id")
      .lean();

    return NextResponse.json(
      {
        success: true,
        seenByUsers,
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
