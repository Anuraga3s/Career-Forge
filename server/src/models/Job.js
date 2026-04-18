const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        role: String,
        fileName: String,
        companyName: String,
        jobDescription: String,
        requiredSkills: [String]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);