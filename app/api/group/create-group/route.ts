import connectDB from "@/app/backend/lib/connectDB";
import Group from "@/app/backend/models/Group";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {

    await connectDB();

    const groupData = await req.json();
    const existGroup = await Group.findOne({ groupName: groupData.groupName });

    if (existGroup) {
      return NextResponse.json({
        success: false,
        status: 409,
        message: "Group name already exists",
        groupData,
      });
    }
    await Group.create(groupData);
    return NextResponse.json({
      status: 200,
      success: true,
      message: "Group Created Successfully!",
      groupData,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      status: 500,
      message: err,
    });
  }
}
