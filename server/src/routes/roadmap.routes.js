const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createRoadmap,
  getAllRoadmaps,
  getRoadmapByStream,
  getRoadmapById,
  updateRoadmapProgress,
} = require("../controllers/roadmap.controller");

router.post(
  "/create",
  authMiddleware,
  createRoadmap
);

router.get(
  "/all",
  authMiddleware,
  getAllRoadmaps
);

router.get(
  "/stream/:stream",
  authMiddleware,
  getRoadmapByStream
);

router.get(
  "/:id",
  authMiddleware,
  getRoadmapById
);

router.put(
  "/:roadmapId/progress",
  authMiddleware,
  updateRoadmapProgress
);

module.exports = router;