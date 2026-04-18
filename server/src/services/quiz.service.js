const axios = require("axios");
const quizBank = {
  SQL: [
    {
      question: "Which join returns all rows from left table?",
      options: [
        "INNER JOIN",
        "LEFT JOIN",
        "RIGHT JOIN",
        "FULL JOIN",
      ],
      correctAnswer: "LEFT JOIN",
    },
    {
      question: "Which keyword is used to sort data?",
      options: ["SORT", "ORDER BY", "GROUP", "FILTER"],
      correctAnswer: "ORDER BY",
    },
  ],

  Python: [
    {
      question: "Which data type stores key value pairs?",
      options: ["List", "Tuple", "Dictionary", "Set"],
      correctAnswer: "Dictionary",
    },
    {
      question: "Which keyword defines function?",
      options: ["func", "define", "def", "lambda"],
      correctAnswer: "def",
    },
  ],

  "Data Analysis": [
    {
      question: "Which library is used for data analysis?",
      options: ["NumPy", "Pandas", "Matplotlib", "TensorFlow"],
      correctAnswer: "Pandas",
    },
  ],
};

exports.generateQuizByRoadmap = (
  roadmap = {}
) => {
  const quizQuestions = [];

  if (
    !roadmap ||
    typeof roadmap !== "object"
  ) {
    return [];
  }

  console.log(
    "QUIZ SERVICE ROADMAP:",
    roadmap
  );

  Object.keys(roadmap).forEach(
    (subject) => {
      if (quizBank[subject]) {
        quizQuestions.push(
          ...quizBank[subject]
        );
      }
    }
  );

  return quizQuestions;
};

exports.generateQuizBySubject =
  async function (subject) {
    try {
      const prompt = `
Generate 5 deep concept multiple choice questions for ${subject}.

Rules:
- medium to hard level
- interview focused
- conceptual depth
- exactly 4 options
- one correct answer
- return ONLY JSON array

Format:
[
 {
   "question":"string",
   "options":["A","B","C","D"],
   "correctAnswer":"string"
 }
]
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
                content: prompt,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            },
            timeout: 30000,
          }
        );

      const text =
        response.data.choices[0]
          .message.content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

      return JSON.parse(text);
    } catch (error) {
      console.error("Generate Quiz Error:", error.message);
      return [];
    }
  };