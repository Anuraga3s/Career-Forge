const Quiz = require("../models/Quiz");
const Roadmap = require("../models/Roadmap");

const {
  generateQuizByRoadmap,
  generateQuizBySubject,
} = require("../services/quiz.service");

exports.createQuiz = async (
  req,
  res
) => {
  try {
    const { roadmapId } = req.body;

    const roadmapDoc =
      await Roadmap.findById(
        roadmapId
      );

    if (!roadmapDoc) {
      return res.status(404).json({
        message: "Roadmap not found",
      });
    }

    const actualRoadmap =
      roadmapDoc?.roadmap?.roadmap ||
      roadmapDoc?.roadmap ||
      {};

    const questions =
      generateQuizByRoadmap(
        actualRoadmap
      );

    const quiz = await Quiz.create({
      userId: req.user.id,
      roadmapId,
      subject: "Overall",
      questions,
      totalQuestions:
        questions.length,
    });

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getQuizById = async (
  req,
  res
) => {
  try {
    const quiz =
      await Quiz.findById(
        req.params.id
      );

    if (!quiz) {
      return res.status(404).json({
        message:
          "Quiz not found",
      });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.submitQuiz = async (
  req,
  res
) => {
  try {
    const {
      quizId,
      score,
      weakTopics,
    } = req.body;

    const quiz =
      await Quiz.findById(
        quizId
      );

    quiz.score = score;
    quiz.weakTopics =
      weakTopics;

    await quiz.save();

    res.status(200).json({
      message:
        "Quiz submitted",
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

exports.createSubjectQuiz = async (
  req,
  res
) => {
  try {
    const { roadmapId, subject } =
      req.body;

    const roadmapDoc =
      await Roadmap.findById(
        roadmapId
      );

    if (!roadmapDoc) {
      return res.status(404).json({
        message: "Roadmap not found",
      });
    }

    const questions =
      await generateQuizBySubject(
        subject
      );

    const quiz =
      await Quiz.create({
        userId: req.user.id,
        roadmapId,
        subject, // IMPORTANT
        questions,
        totalQuestions:
          questions.length,
      });


    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getQuizHistory =
  async (req, res) => {
    try {
      const history = await Quiz.find({
        userId: req.user.id,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json(
        history
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };