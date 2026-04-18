const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middleware/auth.middleware");

const {
  compareResumeWithJD,
  uploadJD,
  getAllJDs,
  getJDById,
} = require("../controllers/job.controller");

const upload = multer();

router.post(
  "/compare",
  authMiddleware,
  compareResumeWithJD
);

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadJD
);

router.get(
  "/all",
  authMiddleware,
  getAllJDs
);

router.get(
  "/:id",
  authMiddleware,
  getJDById
);

module.exports = router;