import Chat from "@/app/backend/models/Chat";
import Group from "@/app/backend/models/Group";
import GroupMessage from "@/app/backend/models/GroupMessage";
import Message from "@/app/backend/models/Message";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    await Chat.collection.drop();
    await Message.collection.drop();
    await Group.collection.drop();
    await GroupMessage.collection.drop();
    return NextResponse.json({
      message: "Successfully deleted sendRequests, receivedRequests, friends",
    });
  } catch (error) {
    console.log(error);
  }
}
