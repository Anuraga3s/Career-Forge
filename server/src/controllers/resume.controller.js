const Resume = require("../models/Resume");
const pdfParse = require("pdf-parse");
const calculateATS = require("../services/ats.service");

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required"
      });
    }

    const { stream = "CSE" } = req.body;

    if (!["CSE", "Civil", "Mechanical", "MDS"].includes(stream)) {
      return res.status(400).json({
        message: "Invalid stream. Choose from: CSE, Civil, Mechanical, MDS"
      });
    }

    const data = await pdfParse(req.file.buffer);
    const extractedText = data.text;

    const atsResult = calculateATS(extractedText, stream);

    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      stream,
      extractedText,
      ...atsResult
    });

    res.status(201).json({
      message: "Resume uploaded and analyzed successfully",
      resume
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getAllResumes = async (
  req,
  res
) => {
  try {
    const resumes = await Resume.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};