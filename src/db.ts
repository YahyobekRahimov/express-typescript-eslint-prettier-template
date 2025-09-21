import mongoose from "mongoose";
import { MONGO_URI } from "./config/config.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI ?? "");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err}`);
    // Exit the process with a failure code if we can't connect.
    process.exit(1);
  }
};
