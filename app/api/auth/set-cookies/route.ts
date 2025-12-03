import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const res = NextResponse.json({ message: "OK" });
    const { uid } = await req.json();
    res.cookies.set("uid", uid, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return res;
  } catch (error) {
    return Response.json({ error: "Server error" + error }, { status: 500 });
  }
}
