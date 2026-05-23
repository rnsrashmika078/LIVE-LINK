import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/LiveLink";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Already connected to MongoDB");
      return mongoose.connection;
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    return mongoose.connection;
  } catch (err) {
    console.error(
      "MongoDB connection failed:",
      err instanceof Error ? err.message : "Unknown error"
    );
    throw err;
  }
};

export default connectDB;