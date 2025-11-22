import connectDB from "@/app/backend/lib/connectDB";
import User from "@/app/backend/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { uid, name, email, dp } = await req.json();

        const existingUser = await User.findOne({ uid });
        if (existingUser) {
            return NextResponse.json({
                message: "User already exists",
                user: existingUser,
            });
        }

        const newUser = new User({ uid, name, email, dp });
        console.log(newUser);

        await newUser.save();

        return NextResponse.json({
            message: "New Chat Created!",
            user: newUser,
            status: 200,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: "Server error", details: error.message },
            { status: 500 }
        );
    }
}
