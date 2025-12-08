import mongoose from "mongoose";

// Schema definition for each Task card in Kanban board
const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },

    // Which column (Kanban lane) the task belongs to
    status: {
      type: String,
      enum: ["todo", "inprogress", "done"],
      default: "todo",
    },

    // For drag-and-drop ordering inside a column
    position: { type: Number, default: 0 },

    // Link the task to a project
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // Optional: Assign a user
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
