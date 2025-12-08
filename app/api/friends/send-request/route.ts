import connectDB from "@/app/backend/lib/connectDB";
import User from "@/app/backend/models/User";
import { NextResponse } from "next/server";
import Pusher from "pusher";
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});
export async function POST(req: Request) {
  try {
    await connectDB();
    console.log("hit: api/send-request");
    //userId is who the request sent
    //uid from user is who receive the request
    const { requestReceiver, requestSender } = await req.json();
    const {
      dp: rec_dp,
      email: rec_email,
      name: rec_name,
      uid: rec_uid,
    } = requestReceiver;
    const {
      dp: sen_dp,
      email: sen_email,
      name: sen_name,
      uid: sen_uid,
    } = requestSender;

    //check if the already sent requests
    const update = await User.findOne({
      uid: sen_uid,
      sentRequests: rec_uid,
    });

    //check if the user already a friend or not
    const isAFriendAlready = await User.findOne({
      uid: sen_uid,
      friends: rec_uid,
    });
    if (isAFriendAlready) {
      return NextResponse.json({
        message: "users is already a friend of you!",
      });
    }
    if (update) {
      return NextResponse.json({
        message: "already sent!",
      });
    }
    const updateSendRequest = await User.findOneAndUpdate(
      { uid: sen_uid, receivedRequests: { $ne: rec_uid } },
      { $addToSet: { sentRequests: rec_uid } }
    );
    const updateReceivedRequest = await User.findOneAndUpdate(
      { uid: rec_uid, sentRequests: { $ne: sen_uid } },
      { $addToSet: { receivedRequests: sen_uid } }
    );

    await pusher.trigger(`private-notify-${rec_uid}`, "notify", {
      uid: sen_uid,
      name: sen_name,
      email: sen_email,
      dp: sen_dp,
      type: "friend_request",
      message: "You have friend request from " + sen_name,
    });
    // const alreadySent
    return NextResponse.json({
      message: "Request sent successfully!",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
