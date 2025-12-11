import Chat from "@/app/backend/models/Chat";
import Message from "@/app/backend/models/Message";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
 
    await Chat.collection.drop();
    await Message.collection.drop();
    return NextResponse.json({
      message: "Successfully deleted sendRequests, receivedRequests, friends",
    });
  } catch (error) {
    console.log(error);
  }
}
