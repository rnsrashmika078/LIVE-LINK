import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DB,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.log(
      "❌ MongoDB connection failed:",
      err instanceof Error && err.message
    );
 
  }
};

export default connectDB;
