const axios = require("axios");

module.exports = async function analyzeSkillGap(
  resumeText,
  jobDescription
) {
  try {
    const prompt = `
You are an expert ATS resume analyzer.

Compare the resume with the job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY valid JSON in this format:
{
  "matchScore": number,
  "matchedSkills": [],
  "missingSkills": [],
  "suggestions": "string"
}

Rules:
- matchScore should be between 0 and 100
- matchedSkills = skills present in both resume and JD
- missingSkills = skills present in JD but absent in resume
- suggestions = short improvement suggestion
- ONLY JSON
- NO markdown
- NO code block
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const aiText =
      response.data.choices[0].message.content;

    const cleanedText = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleanedText);

    return {
      matchScore: result.matchScore || 0,
      matchedSkills:
        result.matchedSkills || [],
      missingSkills:
        result.missingSkills || [],
      suggestions:
        result.suggestions ||
        "Improve missing skills",
    };
  } catch (error) {
    console.error(
      "AI Skill Gap Error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.error?.message ||
      error.message ||
      "AI analysis failed. Please try again."
    );
  }
};