import mongoose from "mongoose";

// Message schema
const MessageSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
        },
        chatId: {
            type: String,
            required: true,
        },
        senderId: {
            type: String,
            required: true,
        },
        receiverId: {
            type: String,
            required: true,
        },
        content: {
            // text message
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["sent", "delivered", "seen"],
            default: "sent",
        },
    },
    { timestamps: true }
);

const Message =
    mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default Message;
