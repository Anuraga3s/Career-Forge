const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fileName: String,
        stream: {
            type: String,
            enum: ["CSE", "Civil", "Mechanical", "MDS"],
            required: true
        },
        extractedText: String,
        atsScore: Number,
        detectedSkills: [String],
        strengths: [String],
        weaknesses: [String],
        suggestions: [String],
        roadmap: { type: Object, default: {} }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);