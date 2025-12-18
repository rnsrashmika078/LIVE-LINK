import connectDB from "@/app/backend/lib/connectDB";
import User from "@/app/backend/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const allUsers = await User.find().lean();

    return NextResponse.json({
      message: "Successfully retrieved all users!",
      allUsers,
      status: 200,
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
