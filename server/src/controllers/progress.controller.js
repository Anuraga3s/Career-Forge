const Roadmap = require("../models/Roadmap");

exports.updateTopicProgress = async (
  req,
  res
) => {
  try {
    const { roadmapId, topic } =
      req.body;

    const roadmap =
      await Roadmap.findById(
        roadmapId
      );

    if (!roadmap) {
      return res.status(404).json({
        message:
          "Roadmap not found",
      });
    }

    // toggle checkbox
    const alreadyCompleted =
      roadmap.completedTopics.includes(
        topic
      );

    if (alreadyCompleted) {
      roadmap.completedTopics =
        roadmap.completedTopics.filter(
          (t) => t !== topic
        );
    } else {
      roadmap.completedTopics.push(
        topic
      );
    }

    // update subject wise progress
    Object.keys(
      roadmap.roadmap
    ).forEach((subject) => {
      const details =
        roadmap.roadmap[
          subject
        ];

      const totalTopics =
        details.topics.length;

      const completedCount =
        details.topics.filter(
          (t) =>
            roadmap.completedTopics.includes(
              t
            )
        ).length;

      details.progress =
        Math.round(
          (completedCount /
            totalTopics) *
            100
        );
    });
    roadmap.markModified("roadmap");

    await roadmap.save();

    res.status(200).json({
      message:
        "Progress updated successfully",
      roadmap,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};