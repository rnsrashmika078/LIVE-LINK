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

    console.log("hit: api/get-send-request");
    //userId is who the request sent
    //uid from user is who receive the request

    const sendRequestsArray = await User.findOne({ uid }).select(
      "sentRequests"
    );

    const sentRequestsUsers = await User.find({
      uid: { $in: sendRequestsArray?.sentRequests || [] },
    });

    if (!sentRequestsUsers) {
      return NextResponse.json({
        message: "error",
        sendRequests: [],
      });
    }

    return NextResponse.json({
      message: "Send Requests fetched successfully",
      sendRequests: sentRequestsUsers || [],
    });
  } catch (error) {
    console.log(error);
  }
}
