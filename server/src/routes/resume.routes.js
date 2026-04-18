const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middleware/auth.middleware");

const {
    uploadResume,
    getAllResumes,
} = require("../controllers/resume.controller");

const upload = multer();

router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    uploadResume
);

router.get(
    "/all",
    authMiddleware,
    getAllResumes
);

module.exports = router;