import connectDB from "@/app/backend/lib/connectDB";
import User from "@/app/backend/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { searchParam: string; userId: string } }
) {
  try {
    await connectDB();
    console.log("hit: api/search-friend");
    const { searchParam, userId } = await params;

    if (!searchParam)
      return NextResponse.json({
        success: false,
        users: [],
        message: "No result found!",
      });

    const users = await User.find({
      _id: { $ne: userId },
      name: { $regex: searchParam, $options: "i" },
    }).limit(10);

    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        users: [],
        message: "No result found!",
      });
    }
    return NextResponse.json({
      sucess: true,
      message: "Successfully get the users",
      users,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error: true });
  }
}
