const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        sessionId: String,
        role: String,
        question: String,
        answer: String,
        score: Number,
        feedback: String,
        jdContext: String
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "Interview",
    interviewSchema
);