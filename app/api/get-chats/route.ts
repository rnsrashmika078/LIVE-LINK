import connectDB from "@/app/backend/lib/connectDB";
import Chat from "@/app/backend/models/Chat";

export async function GET() {
    try {
        await connectDB();

        const chats = await Chat.find();

        console.log("Chats", chats);
        return Response.json({
            message: "Successfully getting all ther users!",
            chats,
            status: 200,
        });
    } catch (error) {
        return Response.json(
            { error: "Server error" + error },
            { status: 500 }
        );
    }
}
