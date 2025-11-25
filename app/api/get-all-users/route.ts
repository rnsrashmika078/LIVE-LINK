import connectDB from "@/app/backend/lib/connectDB";
import User from "@/app/backend/models/User";

export async function GET() {
  try {
    await connectDB();

    const allUsers = await User.find();

    console.log("All users", allUsers);
    return Response.json({
      message: "Successfully getting all ther users!",
      allUsers,
      status: 200,
    });
  } catch (error) {
    return Response.json({ error: "Server error" + error }, { status: 500 });
  }
}
