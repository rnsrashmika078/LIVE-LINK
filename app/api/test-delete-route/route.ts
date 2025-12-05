import Chat from "@/app/backend/models/Chat";
import Message from "@/app/backend/models/Message";
import User from "@/app/backend/models/User";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    console.log("Hit: api/test-delete-route");

    // const delStatus = await User.updateMany(
    //   {},
    //   { $set: { friends: [], sentRequests: [], receivedRequests: [] } }
    // );

    await Chat.deleteMany();
    await Message.deleteMany();

    // if (!delStatus) {
    //   return NextResponse.json({
    //     message: "failed to delete the data",
    //   });
    // }
    return NextResponse.json({
      message: "Successfully deleted sendRequests, receivedRequests, friends",
    });
  } catch (error) {
    console.log(error);
  }
}
