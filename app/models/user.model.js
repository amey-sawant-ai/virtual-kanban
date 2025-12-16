import mongoose from "mongoose";

// Basic user model (expand later if using auth)
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
