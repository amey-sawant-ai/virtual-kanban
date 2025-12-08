// lib/mongoose.js
import mongoose from "mongoose";

// 1) Load the connection string from .env
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in your .env file");
}

// 2) Use a global cache so dev hot reload doesn't create many connections
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

// 3) Main function — called before using any model
export async function connectDB() {
  // 3A) If we already have a live connection, reuse it
  if (cached.conn) return cached.conn;

  // 3B) If no connection is in progress, start one
  if (!cached.promise) {
    const opts = { bufferCommands: false }; // fail fast if disconnected
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => mongooseInstance);
  }

  // 3C) Wait for the connection to finish and store it
  cached.conn = await cached.promise;
  return cached.conn;
}
