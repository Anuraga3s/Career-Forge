const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stream: {
      type: String,
      enum: ["CSE", "Civil", "Mechanical", "MDS"],
      required: true
    },
    role: String,
    jobDescription: String,
    matchScore: Number,
    missingSkills: [String],
    roadmap: Object,
    completedTopics: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Roadmap",
  roadmapSchema
);