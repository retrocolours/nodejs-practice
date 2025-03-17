const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: String,
    description: String,
    screenshot: String,
    tech: [String],
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "Projects" }
);
module.exports = mongoose.model("Project", ProjectSchema);
