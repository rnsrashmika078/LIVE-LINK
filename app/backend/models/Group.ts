import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    groupMembers: [
      {
        userId: { type: String, required: true },

        firstName: { type: String, required: true },

        lastName: { type: String, required: true },
      },
    ],
  
  },
  {
    timestamps: true,
  }
);
const Group = mongoose.models.Group || mongoose.model("Group", GroupSchema);

export default Group;
