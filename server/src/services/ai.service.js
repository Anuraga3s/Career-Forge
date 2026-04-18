const axios = require("axios");

const evaluateInterviewAnswerAI = async (
    question,
    answer
) => {
    const prompt = `
You are an expert AI placement coach helping students prepare for technical interviews.

Evaluate the answer like a real interviewer.

IMPORTANT RULES:
- Score strictly from 0 to 10
- If the answer is irrelevant, incomplete, or too short, give 0–2
- If partially correct, give 3–6
- If strong and detailed, give 7–10
- Speak directly to the student using "you"
- Feedback must be impactful, precise, and actionable
- Mention exactly what was missing
- Suggest how the student should improve
- Keep the tone supportive but realistic

Return ONLY valid JSON:

{
  "score": number,
  "feedback": "clear and impactful coaching feedback",
  "improvementPoints": ["point1", "point2"]
}

Question: ${question}

Student Answer: ${answer}
`;

    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            model: "openai/gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.APP_URL,
                "X-Title": "AI Placement Coach"
            },
            timeout: 30000
        }
    );

    return response.data.choices[0].message.content;
};

const generateAdaptiveQuestionAI = async (
    role,
    difficulty,
    jdContext,
    useJDContext
) => {
    const prompt = `
You are an expert AI placement coach conducting a technical interview.

${useJDContext ? `The candidate is struggling with basic concepts. Ask a question directly related to the Job Description to give them a chance to demonstrate relevant experience.

Job Description Context:
${jdContext}` : `Generate a ${difficulty} level technical interview question for a ${role} role.`}

IMPORTANT:
- Question should assess core competencies for the ${role} role
- Make it specific and open-ended (not yes/no)
- Should test practical understanding
${useJDContext ? "- Directly reference the job requirements they're struggling with" : "- Appropriate difficulty level: " + difficulty}

Return ONLY the question as plain text (no JSON, no quotes, just the question).
`;

    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            model: "openai/gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.APP_URL,
                "X-Title": "AI Placement Coach"
            },
            timeout: 30000
        }
    );

    return response.data.choices[0].message.content.trim();
};

const generateRoadmapFromJD = async (
    jdText,
    resumeSkills,
    matchedSkills,
    missingSkills
) => {
    const prompt = `
You are an expert AI placement coach.

Create a STRICTLY role-specific learning roadmap.

VERY IMPORTANT RULES:
- Use ONLY subjects relevant to the job role
- DO NOT use generic web development roadmap unless JD asks for it
- For AI/ML roles use:
  Python, ML, DL, Neural Networks, LangChain, LLMs, RAG, Deployment
- For data roles use:
  SQL, Python, Pandas, NumPy, Excel, Statistics, Visualization
- For frontend roles use:
  JavaScript, React, State Management, APIs
- For backend roles use:
  Node, Express, MongoDB, Authentication, System Design

Resume Skills:
${resumeSkills.join(", ")}

Matched Skills:
${matchedSkills.join(", ")}

Missing Skills:
${missingSkills.join(", ")}

Job Description:
${jdText}

Return ONLY valid JSON.

Format:
{
  "subject": {
    "progress": 0,
    "topics": []
  }
}
`;

    const response =
        await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model:
                    "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type":
                        "application/json",
                    "HTTP-Referer":
                        process.env.APP_URL,
                    "X-Title":
                        "AI Placement Coach"
                },
                timeout: 30000,
            }
        );

    const raw =
        response.data.choices[0]
            .message.content;

    return JSON.parse(
        raw
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()
    );
};

module.exports = {
    evaluateInterviewAnswerAI,
    generateAdaptiveQuestionAI,
    generateRoadmapFromJD
};