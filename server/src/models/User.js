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
            default: null
        },
        googleId: {
            type: String,
            default: null
        },
        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local"
        },
        avatar: {
            type: String,
            default: null
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
