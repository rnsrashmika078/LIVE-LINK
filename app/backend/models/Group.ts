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
    lastMessage: [
      {
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
    ],
    participants: [{ type: String }],
  },
  {
    timestamps: true,
  }
);
const Group = mongoose.models.Group || mongoose.model("Group", GroupSchema);

export default Group;
