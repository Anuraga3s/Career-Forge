const topicBank = require("./learningRoadmap.service");

exports.generateRoadmap = (
    missingSkills,
    matchedSkills = []
) => {
    const roadmap = {};

    const allSkills = [
        ...matchedSkills,
        ...missingSkills
    ];

    if (allSkills.length === 0) {
        return {
            general: {
                progress: 0,
                topics: [
                    "DSA",
                    "Projects",
                    "Mock interviews"
                ]
            }
        };
    }

    allSkills.forEach((skill) => {
        roadmap[skill] = {
            progress: matchedSkills.includes(
                skill
            )
                ? 100
                : 0,
            topics:
                topicBank[skill] || [
                    "Basics",
                    "Intermediate",
                    "Projects"
                ]
        };
    });

    return roadmap;
};