import mongoose from "mongoose";

const StatusSchema = new mongoose.Schema(
  {
    statusId: {
      type: String,
      required: true,
    },
    uid: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    dp: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    content: {
      file: {
        url: { type: String, required: false },
        format: { type: String, required: false },
        name: { type: String, required: false },
        public_id: { type: String, required: false },
      },
      caption: {
        caption: { type: String, required: false },
        color: { type: String, required: false },
      },
    },
    createdAt: {
      type: String,
      required: false,
    },
    seenBy: [
      {
        dp: { type: String, required: false },
        name: { type: String, required: false },
        uid: { type: String, required: true },
        createdAt: { type: String, required: false },
        statusId: { type: String, required: false },
      },
    ],
  },
  { timestamps: true }
);
const Status = mongoose.models.Status || mongoose.model("Status", StatusSchema);
export default Status;
