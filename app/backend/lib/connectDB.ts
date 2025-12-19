import mongoose, { MongooseError } from "mongoose";
import { NextResponse } from "next/server";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DB,
    });
    console.log("✅ MongoDB connected");
    return NextResponse.json({
      message: "✅ MongoDB connected",
      success: true,
      status: 200,
    });
  } catch (err) {
    console.log(
      "❌ MongoDB connection failed:",
      err instanceof MongooseError && err.message
    );

    return NextResponse.json({
      message: err instanceof MongooseError && err.message,
      success: false,
      status: 500,
    });
  }
};

export default connectDB;
