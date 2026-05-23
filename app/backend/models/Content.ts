import mongoose from "mongoose";
// import Message from "./Message";

const ContentSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
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
  { timestamps: true }
);

const Content =
  mongoose.models.Content || mongoose.model("Content", ContentSchema);

export default Content;
