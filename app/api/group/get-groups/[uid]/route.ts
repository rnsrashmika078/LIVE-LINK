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
    const { uid } = await params;

    const groups = await Group.find({ "participants": uid });
    console.log("groups ", groups);
    console.log("uid ", uid);

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
