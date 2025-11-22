import connectDB from "@/app/backend/lib/connectDB";
import Chat from "@/app/backend/models/Chat";

export async function POST(req: Request) {
    try {
        await connectDB();
        const {
            friendId,
            friendName,
            friendEmail,
            friendDp,
            uid,
            name,
            email,
            dp,
            chatId,
            participants,
            lastMessage,
            unreadCount,
        } = await req.json();

        const existChat = await Chat.findOne({ chatId });
        if (existChat) {
            return Response.json({
                message: "Chat is already exist!",
                data: existChat,
                status: 200,
            });
        }
        const NewChat1 = new Chat({
            uid,
            friendId,
            friendName,
            friendEmail,
            friendDp,
            chatId,
            participants,
            lastMessage,
            unreadCount,
        });
        const NewChat2 = new Chat({
            uid: friendId,
            friendId: uid,
            friendName: name,
            friendEmail: email,
            friendDp: dp,
            chatId,
            participants,
            lastMessage,
            unreadCount,
        });

        console.log(NewChat1);
        await NewChat1.save();
        await NewChat2.save();

        return Response.json({
            message: "New Chat Created!",
            data: { NewChat1, NewChat2 },
            status: 200,
        });
    } catch (error) {
        return Response.json(
            { error: "Server error" + error },
            { status: 500 }
        );
    }
}
