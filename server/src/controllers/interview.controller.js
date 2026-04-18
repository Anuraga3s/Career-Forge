const Resume = require("../models/Resume");
const Interview = require("../models/Interview");
const {
    generateQuestions,
    evaluateAnswer,
    generateAdaptiveQuestion
} = require("../services/interview.service");
const {
    evaluateInterviewAnswerAI
} = require("../services/ai.service");

exports.getDashboardSummary = async (req, res) => {
    try {
        const latestResume = await Resume.findOne().sort({
            createdAt: -1
        });

        if (!latestResume) {
            return res.status(404).json({
                message: "No resume data found"
            });
        }

        const atsScore = latestResume.atsScore || 0;

        const detectedSkills =
            latestResume.detectedSkills || [];

        const readinessScore = Math.min(
            Math.round(atsScore * 0.7 + detectedSkills.length * 3),
            100
        );

        res.status(200).json({
            message: "Dashboard data fetched successfully",
            dashboard: {
                atsScore,
                detectedSkills,
                readinessScore,
                status:
                    readinessScore >= 75
                        ? "Placement Ready"
                        : "Needs Improvement"
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.startInterview = async (req, res) => {
    try {
        const { role } = req.body;

        const questions = generateQuestions(role);

        res.status(200).json({
            message: "Interview questions generated",
            questions
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.submitAnswer = async (req, res) => {
    try {
        const { role, question, answer, jdContext, sessionId, score } =
            req.body;

        const aiFeedback =
            await evaluateInterviewAnswerAI(
                question,
                answer
            );

        const interview = await Interview.create({
            userId: req.user.id,
            sessionId,
            role,
            question,
            answer,
            score: score || 0,
            feedback: aiFeedback,
            jdContext
        });

        res.status(201).json({
            message: "AI feedback generated",
            interview
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getNextQuestion = async (req, res) => {
    try {
        const { role, previousScore, jdContext, interviewHistory } = req.body;

        const nextQuestion = await generateAdaptiveQuestion(
            role,
            previousScore,
            jdContext,
            interviewHistory
        );

        res.status(200).json({
            message: "Next question generated",
            question: nextQuestion
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getInterviewHistory = async (req, res) => {
    try {
        const history = await Interview.find({
            userId: req.user.id
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            message: "Interview history fetched successfully",
            history
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getInterviewAnalytics = async (req, res) => {
    try {
        const interviews = await Interview.find();

        if (!interviews.length) {
            return res.status(404).json({
                message: "No interview data found"
            });
        }

        const totalInterviews = interviews.length;

        const averageScore = Math.round(
            interviews.reduce(
                (sum, item) => sum + item.score,
                0
            ) / totalInterviews
        );

        const weakAreas = interviews
            .filter((item) => item.score < 70)
            .map((item) => item.question);

        res.status(200).json({
            message: "Interview analytics fetched",
            analytics: {
                totalInterviews,
                averageScore,
                weakAreas
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};