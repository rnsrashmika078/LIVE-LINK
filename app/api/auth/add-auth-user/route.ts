import connectDB from "@/app/backend/lib/connectDB";
import User from "@/app/backend/models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const result = await connectDB();

    if (result) {
      console.log("result", result);
    }
    const { uid, name, email, dp } = await req.json();

    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      (await cookies()).set("uid", uid, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      return NextResponse.json({
        message: "User already exists",
        user: existingUser,
      });
    }
    (await cookies()).set("uid", uid, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    const newUser = new User({ uid, name, email, dp });
    await newUser.save();

    return NextResponse.json({
      message: "New Chat Created!",
      user: newUser,
      status: 200,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
