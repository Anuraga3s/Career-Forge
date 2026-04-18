const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: String,
      },
    ],

    score: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    weakTopics: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Quiz",
  quizSchema
);