export async function connectDB() {
  // 3A) If we already have a live connection, reuse it
  if (cached.conn) return cached.conn;

  // 3B) If no connection is in progress, start one
  if (!cached.promise) {
    const opts = { bufferCommands: false }; // fail fast if disconnected
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        cached.promise = null; // Reset promise on error to allow retry
        throw error;
      });
  }

  // 3C) Wait for the connection to finish and store it
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
