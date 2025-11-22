import mongoose from "mongoose";

// Message schema
const GroupMessageSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    groupId: { type: String, required: true },
    senderId: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const GroupMessage =
  mongoose.models.GroupMessage ||
  mongoose.model("GroupMessage", GroupMessageSchema);

export default GroupMessage;
