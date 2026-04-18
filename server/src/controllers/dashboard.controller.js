const Resume = require("../models/Resume");
const Interview = require("../models/Interview");
const Roadmap = require("../models/Roadmap");

exports.getDashboardData = async (
    req,
    res
) => {
    try {
        const latestResume =
            await Resume.findOne({
                userId: req.user.id,
            }).sort({
                createdAt: -1,
            });

        const latestInterview =
            await Interview.findOne({
                userId: req.user.id,
            }).sort({
                createdAt: -1
            });

        const roadmaps =
            await Roadmap.find({
                userId: req.user.id,
            }).sort({
                createdAt: -1
            });

        res.status(200).json({
            atsScore:
                latestResume
                    ?.atsScore || 0,

            skills:
                latestResume
                    ?.detectedSkills ||
                [],

            interviewScore:
                latestInterview
                    ?.score || 0,

            roadmaps
        });
    } catch (error) {
        res.status(500).json({
            message:
                error.message
        });
    }
};