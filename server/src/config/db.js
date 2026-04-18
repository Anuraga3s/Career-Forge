const mongoose = require("mongoose");

const connectDB = async (retries = 5, delay = 3000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("✅ MongoDB Connected");
            return;
        } catch (error) {
            console.error(`❌ DB Connection Error (Attempt ${i + 1}/${retries}):`, error.message);
            if (i < retries - 1) {
                console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error("⚠️ Failed to connect to MongoDB after multiple retries");
                process.exit(1);
            }
        }
    }
};

module.exports = connectDB;