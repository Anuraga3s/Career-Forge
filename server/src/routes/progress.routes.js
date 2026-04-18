const express = require("express");
const router = express.Router();

const {
    updateTopicProgress
} = require("../controllers/progress.controller");

router.post(
    "/update-topic",
    updateTopicProgress
);

module.exports = router;