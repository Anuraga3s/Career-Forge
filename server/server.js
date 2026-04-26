const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();
const app = express();

const configuredOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (configuredOrigins.includes(origin)) {
    return true;
  }

  if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
    return true;
  }

  if (/^http:\/\/localhost:\d+$/.test(origin)) {
    return true;
  }

  return false;
};


app.use(
    cors({
        origin(origin, callback) {
            if (isAllowedOrigin(origin)) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true
    })
);

// body parser
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "Server is running", timestamp: new Date() });
});

// routes
const authRoutes = require("./src/routes/auth.routes");
const resumeRoutes = require("./src/routes/resume.routes");
const jobRoutes = require("./src/routes/job.routes");
const interviewRoutes = require("./src/routes/interview.routes");
const progressRoutes = require("./src/routes/progress.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const roadmapRoutes = require("./src/routes/roadmap.routes");
const quizRoutes = require("./src/routes/quiz.routes");

app.use("/api/quiz", quizRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/roadmap", roadmapRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    //console.log(`📍 API available at http://localhost:${PORT}`);
    console.log(`🔗 Client URL(s): ${configuredOrigins.join(", ")}`);
});
