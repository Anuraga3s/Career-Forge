const questionBank = {
    sde: {
        basic: [
            "Explain event loop in JavaScript",
            "Difference between let, var, and const",
            "What is closure in JavaScript",
            "Explain REST API architecture",
            "Difference between SQL and NoSQL",
            "What is callback function",
            "Explain promise in JavaScript",
            "What are arrow functions"
        ],
        intermediate: [
            "How does asynchronous JavaScript work",
            "Explain prototype and prototypal inheritance",
            "What is the difference between call, apply, and bind",
            "How do you optimize a slow API endpoint",
            "Explain debouncing and throttling",
            "What is event delegation",
            "Explain callback hell and how to avoid it",
            "What are generators in JavaScript"
        ],
        advanced: [
            "Design a scalable system architecture",
            "Explain microservices and when to use them",
            "How would you implement a real-time notification system",
            "Design a URL shortening service like bit.ly",
            "Explain database sharding and replication",
            "How would you handle millions of concurrent users",
            "Design a distributed cache system",
            "Explain eventual consistency vs strong consistency"
        ]
    },
    frontend: {
        basic: [
            "What are React hooks",
            "Explain virtual DOM",
            "Difference between state and props",
            "What is component lifecycle",
            "Explain CSS flexbox",
            "What is responsive design",
            "Explain event handling in React",
            "What are controlled components"
        ],
        intermediate: [
            "How does React reconciliation work",
            "Explain useEffect dependency array",
            "What is context API and when to use it",
            "Explain higher-order components",
            "What is code splitting in React",
            "Explain memo, useCallback, useMemo",
            "How to optimize React performance",
            "What are keys in React lists"
        ],
        advanced: [
            "Design a state management solution",
            "Optimize a slow React application rendering",
            "Implement custom hooks for complex logic",
            "Design a real-time collaborative editor",
            "Explain server-side rendering vs client-side rendering",
            "How to implement infinite scroll efficiently",
            "Design a web app that works offline",
            "Explain accessibility (a11y) best practices"
        ]
    }
};

const generateQuestions = (role) => {
    const roleQuestions = questionBank[role.toLowerCase()];
    if (roleQuestions) {
        return [...roleQuestions.basic, ...roleQuestions.intermediate];
    }
    return [
        "Tell me about yourself",
        "Explain your latest project"
    ];
};

const generateAdaptiveQuestion = async (role, previousScore, jdContext, interviewHistory) => {
    const { generateAdaptiveQuestionAI } = require("./ai.service");
    
    const roleQuestions = questionBank[role.toLowerCase()] || {};
    
    // Determine difficulty based on previous score
    let difficulty = "basic";
    if (previousScore >= 7) {
        difficulty = "advanced";
    } else if (previousScore >= 5) {
        difficulty = "intermediate";
    }
    
    // Get available questions for this difficulty
    const availableQuestions = roleQuestions[difficulty] || [];
    
    // Filter out questions already asked
    const askedQuestions = interviewHistory?.map(q => q.question) || [];
    const unusedQuestions = availableQuestions.filter(
        q => !askedQuestions.includes(q)
    );
    
    // If all questions of this difficulty are exhausted, move to next level
    if (unusedQuestions.length === 0) {
        if (difficulty === "basic") {
            difficulty = "intermediate";
        } else if (difficulty === "intermediate") {
            difficulty = "advanced";
        }
        const nextLevelQuestions = roleQuestions[difficulty] || [];
        const nextUnused = nextLevelQuestions.filter(
            q => !askedQuestions.includes(q)
        );
        unusedQuestions.push(...nextUnused);
    }
    
    // If user is struggling (score < 3) ask JD-related question
    if (previousScore < 3 && jdContext) {
        const jdQuestion = await generateAdaptiveQuestionAI(
            role,
            difficulty,
            jdContext,
            true
        );
        return jdQuestion;
    }
    
    // Pick a random question from unused ones
    if (unusedQuestions.length > 0) {
        return unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];
    }
    
    // Fallback if no questions available
    return "Can you elaborate on your experience with " + role + "?";
};

const evaluateAnswer = (answer) => {
    const lengthScore =
        answer.length > 80 ? 80 : answer.length;

    const score = Math.min(
        Math.round(lengthScore / 10) * 10,
        100
    );

    let feedback =
        score >= 70
            ? "Good structured answer"
            : "Try giving more detailed explanation";

    return { score, feedback };
};

module.exports = {
    generateQuestions,
    evaluateAnswer,
    generateAdaptiveQuestion
};