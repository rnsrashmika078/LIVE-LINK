import { number } from "framer-motion";
import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    dp: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: ["Group", "Individual"],
      required: true,
    },
    files: [
      {
        public_id: {
          type: String,
          required: false,
        },
        format: {
          type: String,
          required: false,
        },
        url: {
          type: String,
          required: false,
        },
        name: {
          type: String,
          required: false,
        },
      },
    ],
    seenBy: [
      {
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        status: { type: String, required: true },
        userDp: {
          type: String,
          required: false,
        },
        // this is individual member message status
      },
    ],
    lastMessage: {
      message: {
        type: String,
        required: false,
      },
      name: {
        // sender name
        type: String,
        required: false,
      },
    },
    unreads: [
      {
        userId: { type: String, required: false },
        count: { type: Number, required: false },
      },
    ],
    participants: [
      {
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        userDp: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Group = mongoose.models.Group || mongoose.model("Group", GroupSchema);

export default Group;
