const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    getDashboardSummary,
    startInterview,
    submitAnswer,
    getInterviewHistory,
    getInterviewAnalytics,
    getNextQuestion
} = require("../controllers/interview.controller");

router.get("/dashboard", getDashboardSummary);
router.post("/start", startInterview);
router.post("/submit", auth, submitAnswer);
router.post("/next-question", getNextQuestion);
router.get("/history", auth, getInterviewHistory);
router.get("/analytics", getInterviewAnalytics);

module.exports = router;