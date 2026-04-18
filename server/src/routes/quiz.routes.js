const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createQuiz,
  createSubjectQuiz,
  getQuizById,
  submitQuiz,
  getQuizHistory,
} = require("../controllers/quiz.controller");

router.post(
  "/create",
  authMiddleware,
  createQuiz
);

router.post(
  "/create-subject",
  authMiddleware,
  createSubjectQuiz
);

router.get(
  "/history",
  authMiddleware,
  getQuizHistory
);

router.get(
  "/:id",
  authMiddleware,
  getQuizById
);

router.post(
  "/submit",
  authMiddleware,
  submitQuiz
);

module.exports = router;