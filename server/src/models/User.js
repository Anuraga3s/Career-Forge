const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        college: String,
        branch: String,
        graduationYear: Number,
        targetRole: String,
        skills: [String],
        experienceLevel: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);