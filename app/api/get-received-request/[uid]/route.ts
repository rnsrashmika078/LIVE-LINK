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

    console.log("hit: api/get-received-request");

    //userId is who the request sent
    //uid from user is who receive the request

    const receivedRequestsIdArray = await User.findOne({ uid }).select(
      "receivedRequests"
    );

    const requestUsers = await User.find({
      uid: { $in: receivedRequestsIdArray?.receivedRequests || [] },
    }).select("uid name email dp");

    if (!requestUsers) {
      return NextResponse.json({
        message: "error",
        receivedRequests: [],
      });
    }

    console.log("received", requestUsers);

    return NextResponse.json({
      message: "Send Requests fetched successfully",
      receivedRequests: requestUsers || [],
    });
  } catch (error) {
    console.log(error);
  }
}
