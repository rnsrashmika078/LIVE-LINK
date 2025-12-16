import connectDB from "@/app/backend/lib/connectDB";
import User from "@/app/backend/models/User";
import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function POST(req: Request) {
  try {

    exec("npm run dev");

    return NextResponse.json({
      message: "New Chat Created!",
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
