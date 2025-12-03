import connectDB from "@/app/backend/lib/connectDB";
import User from "@/app/backend/models/User";

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
    console.log("hit: api/add-new-friend");

    const { user, friend } = await req.json();
    const { dp: rec_dp, email: rec_email, name: rec_name, uid: rec_uid } = user;
    const {
      dp: sen_dp,
      email: sen_email,
      name: sen_name,
      uid: sen_uid,
    } = friend;

    await User.findOneAndUpdate(
      { uid: sen_uid },
      {
        $addToSet: {
          friends: rec_uid,
        },
      }
    );
    await User.findOneAndUpdate(
      { uid: rec_uid },
      {
        $addToSet: {
          friends: sen_uid,
        },
      }
    );

    console.log("sen", sen_uid);

    // Remove from sender's sentRequests
    await User.updateOne(
      { uid: rec_uid },
      { $pull: { sentRequests: sen_uid } }
    );

    // Remove from receiver's receivedRequests
    await User.updateOne(
      { uid: sen_uid },
      { $pull: { receivedRequests: rec_uid } }
    );

    await pusher.trigger(`presence-notify-${rec_uid}`, "notify", {
      // uid: sen_uid,
      // name: sen_name,
      // email: sen_email,
      // dp: sen_dp,
      type: "friend_accept",
      message: `Your Friend request accepted by ${sen_name}`,
    });

    return Response.json({
      status: 200,
      success: true,
      message: "You have added new friend to user list!",
    });
  } catch (error) {
    console.log("from add friend route", error);
    return Response.json({ error: "Server error" + error }, { status: 500 });
  }
}
