import connectDB from "@/app/backend/lib/connectDB";
import Group from "@/app/backend/models/Group";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { uid: string };
  }
) {
  try {
    await connectDB();
    const { uid } = await params;

    const groups = await Group.find({ "participants.userId": uid });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Group  Successfully!",
      groups,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      status: 500,
      message: err,
    });
  }
}
