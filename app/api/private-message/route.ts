import { NextResponse } from "next/server";
import Pusher from "pusher";
// import Message from "@/src/server_side/backend/models/Message";
// import Conversation from "@/src/server_side/backend/models/Conversation";
// import connectDB from "@/src/server_side/backend/lib/connectDB";

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
});

export async function POST(req: Request) {
    try {
        // await connectDB();
        const { id, chatId, content, senderId, receiverId } = await req.json();

    
        await pusher.trigger(`private-user-${chatId}`, "chat", {
            id,
            chatId,
            senderId,
            receiverId,
            content,
        });
        // await newMessage.save();

        return NextResponse.json({ status: "ok", message: content });
    } catch (error) {
        console.error("Error in /api/message:", error);
        return NextResponse.json(
            { error: "Server error", message: "no message while error" },
            { status: 500 }
        );
    }
}
