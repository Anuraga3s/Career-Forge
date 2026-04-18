const {
    generateRoadmap
} = require("../services/learningRoadmap.service");
const Roadmap = require("../models/Roadmap");

exports.createRoadmap = async (
    req,
    res
) => {
    try {
        const {
            stream = "CSE",
            role,
            jobDescription,
            missingSkills,
            matchScore
        } = req.body;

        if (!["CSE", "Civil", "Mechanical", "MDS"].includes(stream)) {
            return res.status(400).json({
                message: "Invalid stream. Choose from: CSE, Civil, Mechanical, MDS"
            });
        }

        if (
            !missingSkills ||
            !Array.isArray(missingSkills)
        ) {
            return res.status(400).json({
                message: "missingSkills array is required"
            });
        }

        const roadmap = generateRoadmap(missingSkills, stream);

        const savedRoadmap = await Roadmap.create({
            userId: req.user.id,
            stream,
            role,
            jobDescription: jobDescription || "",
            matchScore: matchScore || 0,
            missingSkills,
            roadmap,
            completedTopics: []
        });

        res.status(201).json({
            message: "Roadmap created successfully",
            roadmap: savedRoadmap
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getAllRoadmaps = async (
    req,
    res
) => {
    try {
        const roadmaps = await Roadmap.find({
            userId: req.user.id,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            roadmaps
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getRoadmapByStream = async (req, res) => {
    try {
        const { stream } = req.params;

        if (!["CSE", "Civil", "Mechanical", "MDS"].includes(stream)) {
            return res.status(400).json({
                message: "Invalid stream"
            });
        }

        const roadmap = await Roadmap.findOne({
            userId: req.user.id,
            stream
        }).sort({ createdAt: -1 });

        if (!roadmap) {
            return res.status(404).json({
                message: `No roadmap found for stream: ${stream}`
            });
        }

        res.status(200).json({
            roadmap
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.updateRoadmapProgress = async (req, res) => {
    try {
        const { roadmapId } = req.params;
        const { completedTopics } = req.body;

        const roadmap = await Roadmap.findByIdAndUpdate(
            roadmapId,
            { completedTopics },
            { new: true }
        );

        if (!roadmap) {
            return res.status(404).json({
                message: "Roadmap not found"
            });
        }

        res.status(200).json({
            message: "Roadmap updated successfully",
            roadmap
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getRoadmapById = async (
    req,
    res
) => {
    try {
        const roadmap =
            await Roadmap.findById(
                req.params.id
            );

        if (!roadmap) {
            return res.status(404).json({
                message:
                    "Roadmap not found"
            });
        }

        res.status(200).json({
            roadmap
        });
    } catch (error) {
        res.status(500).json({
            message:
                error.message
        });
    }
};

exports.addSuggestion = async (
    req,
    res
) => {
    try {
        const { roadmapId, suggestion } =
            req.body;

        const roadmap =
            await Roadmap.findById(
                roadmapId
            );

        if (!roadmap) {
            return res.status(404).json({
                message:
                    "Roadmap not found"
            });
        }

        roadmap.suggestions.push(
            suggestion
        );

        await roadmap.save();

        res.status(200).json({
            message:
                "Suggestion added successfully",
            suggestions:
                roadmap.suggestions
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};