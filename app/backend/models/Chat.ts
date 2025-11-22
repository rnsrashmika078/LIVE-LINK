import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
    {
        // name: { type: String, required: false },
        // email: { type: String, required: false },
        // dp: { type: String, required: false },

        uid: { type: String, required: false },
        friendId: {
            type: String,
            required: false,
        },
        friendName: {
            type: String,
            required: false,
        },
        friendEmail: {
            type: String,
            required: false,
        },
        friendDp: {
            type: String,
            required: false,
        },
        chatId: {
            type: String,
            required: true,
        },
        participants: [
            {
                uid: { type: String, required: true },
                name: {
                    type: String,
                    required: false,
                },
                email: {
                    type: String,
                    required: false,
                },
                dp: {
                    type: String,
                    required: false,
                },
            },
        ],
        lastMessage: {
            type: String,
            required: false,
        },
        unreadCount: [
            {
                userId: { type: String, required: true },
                count: { type: Number, required: true },
            },
        ],
        // status: {
        //     type: String,
        //     enum: ["sent", "delivered", "seen"],
        //     default: "sent",
        // },
    },
    { timestamps: true }
);

const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

export default Chat;
