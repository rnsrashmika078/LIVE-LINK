import { NextResponse } from "next/server";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-User-Id");
    const name = req.headers.get("x-User-name");
    const email = req.headers.get("x-User-email");
    const dp = req.headers.get("x-User-dp");
    // Parse URL-encoded form data
    const formData = await req.formData();
    const socket_id = formData.get("socket_id")?.toString();
    const channel_name = formData.get("channel_name")?.toString();

    if (!socket_id || !channel_name) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const auth = pusher.authorizeChannel(socket_id, channel_name, {
      user_id: userId!,
      user_info: { userId, name, email, dp },
    });

    return NextResponse.json(auth);
  } catch (error) {
    console.error("Error in /api/pusher/auth:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
