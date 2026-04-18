const Resume = require("../models/Resume");
const Roadmap = require("../models/Roadmap");

const analyzeSkillGap = require("../services/recommendation.service");

const {
  generateRoadmapFromJD
} = require("../services/ai.service");

exports.compareResumeWithJD =
  async (req, res) => {
    try {
      const {
        jobDescription,
        resumeId,
        jdTitle,
        stream
      } = req.body;

      const resume =
        await Resume.findById(
          resumeId
        );

      if (!resume) {
        return res
          .status(404)
          .json({
            message:
              "No uploaded resume found"
          });
      }

      // Validate stream
      const validStreams = ["CSE", "Civil", "Mechanical", "MDS"];
      const selectedStream = stream && validStreams.includes(stream) ? stream : "CSE";

      const result =
        await analyzeSkillGap(
          resume.extractedText,
          jobDescription
        );

      const roadmap =
        await generateRoadmapFromJD(
          jobDescription,
          resume.detectedSkills,
          result.matchedSkills,
          result.missingSkills
        );

      const initialSuggestions = [
        "Focus on weak skills identified from JD",
        "Practice 2 mock interviews for this role",
        "Complete missing roadmap topics"
      ];

      const roleTitle =
        `${resume.fileName} vs ${jdTitle || "Selected JD"}`;

      const savedRoadmap =
        await Roadmap.create({
          userId: req.user.id,
          stream: selectedStream,
          role: roleTitle,
          jobDescription,
          matchScore: result.matchScore,
          missingSkills: result.missingSkills,
          roadmap,
          completedTopics: [],
          suggestions: initialSuggestions
        });

      res.status(200).json({
        message:
          "JD comparison completed",
        analysis:
          result,
        roadmap:
          savedRoadmap
      });
    } catch (error) {
      console.error("Compare Error:", error);
      res.status(500).json({
        message:
          error.message || "Comparison failed. Please try again.",
        error: error.message
      });
    }
  };

const Job = require("../models/Job");
const pdfParse = require("pdf-parse");

exports.uploadJD = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "JD file required",
      });
    }

    const data = await pdfParse(req.file.buffer);

    const jd = await Job.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      role: req.file.originalname,
      jobDescription: data.text,
    });

    res.status(201).json(jd);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllJDs = async (req, res) => {
  try {
    const jobs = await Job.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getJDById = async (req, res) => {
  try {
    const jd = await Job.findById(
      req.params.id
    );

    if (!jd) {
      return res.status(404).json({
        message: "JD not found",
      });
    }

    res.status(200).json(jd);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};