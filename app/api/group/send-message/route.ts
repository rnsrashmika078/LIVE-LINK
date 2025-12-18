import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("Message payload", payload);

    return NextResponse.json({
      success: true,
      message: "Message save in db successfully!",
      status: 202,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: err,
      status: 505,
    });
  }
}
