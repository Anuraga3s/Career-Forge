import { useState, useEffect, useRef } from "react";
import api from "../services/api";

export default function MockInterview() {
    const [role, setRole] = useState("sde");
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [interviewHistory, setInterviewHistory] = useState([]);
    const [totalScore, setTotalScore] = useState(0);
    const [jdContext, setJdContext] = useState("");
    const [sessionId, setSessionId] = useState(null);
    const [pastInterviews, setPastInterviews] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [interviewHistory, feedback]);

    // Load interview history on component mount
    useEffect(() => {
        const fetchHistoryOnMount = async () => {
            try {
                setHistoryLoading(true);
                const response = await api.get("/interview/history");
                // Group interviews by sessionId
                const grouped = {};
                response.data.history.forEach((interview) => {
                    const sid = interview.sessionId || "unknown";
                    if (!grouped[sid]) {
                        grouped[sid] = {
                            sessionId: sid,
                            role: interview.role,
                            date: interview.createdAt,
                            questions: [],
                            totalScore: 0
                        };
                    }
                    grouped[sid].questions.push(interview);
                    grouped[sid].totalScore += interview.score || 0;
                });
                setPastInterviews(Object.values(grouped));
            } catch (error) {
                console.log("No past interviews yet");
            } finally {
                setHistoryLoading(false);
            }
        };
        
        if (!interviewStarted) {
            fetchHistoryOnMount();
        }
    }, [interviewStarted]);

    const startInterview = async () => {
        try {
            setLoading(true);
            const newSessionId = Date.now().toString();
            setSessionId(newSessionId);
            
            const response = await api.post("/interview/start", {
                role
            });
            setQuestion(response.data.questions[0]);
            setInterviewStarted(true);
            setShowHistory(false);
            setInterviewHistory([]);
            setTotalScore(0);
            setFeedback(null);
        } catch (error) {
            alert("Failed to start interview: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!answer.trim()) {
            alert("Please provide an answer");
            return;
        }

        try {
            setLoading(true);
            
            const currentScore = feedback?.score || 0;

            const response = await api.post("/interview/submit", {
                role,
                question,
                answer,
                jdContext,
                sessionId,
                score: currentScore
            });

            try {
                const rawFeedback = response.data.interview.feedback;
                let cleanedFeedback = rawFeedback
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();
                const parsedFeedback = JSON.parse(cleanedFeedback);
                setFeedback(parsedFeedback);

                // Add to history
                const newHistory = [...interviewHistory, { question, answer, feedback: parsedFeedback }];
                setInterviewHistory(newHistory);
                setTotalScore(totalScore + (parsedFeedback.score || 0));
            } catch (error) {
                const fallbackFeedback = {
                    score: 5,
                    feedback: response.data.interview.feedback,
                    improvementPoints: ["Provide more detailed explanations", "Cite concrete examples"]
                };
                setFeedback(fallbackFeedback);
                const newHistory = [...interviewHistory, { question, answer, feedback: fallbackFeedback }];
                setInterviewHistory(newHistory);
                setTotalScore(totalScore + 5);
            }

            setAnswer("");
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const getNextQuestion = async () => {
        try {
            setLoading(true);
            const averageScore = totalScore / (interviewHistory.length || 1);
            
            const response = await api.post("/interview/next-question", {
                role,
                previousScore: Math.round(averageScore),
                jdContext,
                interviewHistory: interviewHistory.map(h => ({ question: h.question }))
            });

            setQuestion(response.data.question);
            setFeedback(null);
            setAnswer("");
        } catch (error) {
            alert("Error loading next question: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const endInterview = () => {
        const avgScore = interviewHistory.length > 0 ? (totalScore / interviewHistory.length).toFixed(1) : 0;
        alert(
            `Interview Completed!\n\n` +
            `Questions Answered: ${interviewHistory.length}\n` +
            `Average Score: ${avgScore}/10\n` +
            `Total Score: ${totalScore}\n\n` +
            `Great effort! Practice makes perfect.`
        );
        setInterviewStarted(false);
        setInterviewHistory([]);
        setTotalScore(0);
        setFeedback(null);
        setSessionId(null);
    };

    if (!interviewStarted) {
        return (
            <div style={{ minHeight: "100vh", background: "#0b1120", color: "white", padding: "20px", overflow: "visible", display: "flex", flexDirection: "column", gap: "20px", width: "100%", boxSizing: "border-box" }}>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
                    <button
                        onClick={() => setShowHistory(false)}
                        style={{
                            padding: "10px 20px",
                            background: !showHistory ? "#2563eb" : "#475569",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            transition: "all 0.3s ease"
                        }}
                    >
                        🎤 Start New Interview
                    </button>
                    <button
                        onClick={() => setShowHistory(true)}
                        style={{
                            padding: "10px 20px",
                            background: showHistory ? "#2563eb" : "#475569",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            transition: "all 0.3s ease"
                        }}
                    >
                        📊 Interview History
                    </button>
                </div>

                {!showHistory ? (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "20px", flex: 1 }}>
                        <h1 style={{ fontSize: "clamp(28px, 5vw, 32px)", textAlign: "center", marginBottom: "10px" }}>🎤 Mock Interview</h1>
                        <p style={{ fontSize: "16px", color: "#94a3b8", textAlign: "center", maxWidth: "700px", width: "100%" }}>
                            Practice real interview questions with AI-powered feedback. Start from basics and progress to advanced topics!
                        </p>

                        <div style={{
                            background: "#1e293b",
                            padding: "30px",
                            borderRadius: "16px",
                            maxWidth: "760px",
                            width: "100%",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(59,130,246,0.15)",
                            border: "1px solid rgba(59,130,246,0.2)",
                            boxSizing: "border-box"
                        }}>
                            <label style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "10px", display: "block" }}>
                                Select Job Role:
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginBottom: "20px",
                                    borderRadius: "8px",
                                    background: "#0f172a",
                                    color: "white",
                                    border: "1px solid #3b82f6",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    boxSizing: "border-box"
                                }}
                            >
                                <option value="sde">Software Development Engineer (SDE)</option>
                                <option value="frontend">Frontend Developer</option>
                                <option value="backend">Backend Developer</option>
                            </select>

                            <label style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "10px", display: "block" }}>
                                Job Description (Optional - for context-aware questions):
                            </label>
                            <textarea
                                value={jdContext}
                                onChange={(e) => setJdContext(e.target.value)}
                                placeholder="Paste job description for better question recommendations..."
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginBottom: "20px",
                                    borderRadius: "8px",
                                    background: "#0f172a",
                                    color: "white",
                                    border: "1px solid #3b82f6",
                                    fontSize: "14px",
                                    resize: "vertical",
                                    minHeight: "80px",
                                    fontFamily: "Arial",
                                    boxSizing: "border-box"
                                }}
                            />

                            <button
                                onClick={startInterview}
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "8px",
                                    background: loading ? "#475569" : "#2563eb",
                                    color: "white",
                                    border: loading ? "none" : "1px solid rgba(37, 99, 235, 0.5)",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    boxShadow: loading ? "none" : "0 10px 25px rgba(37, 99, 235, 0.3), 0 0 15px rgba(37, 99, 235, 0.2)",
                                    transition: "all 0.3s ease",
                                    opacity: loading ? 0.6 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.transform = "translateY(-3px)";
                                        e.currentTarget.style.boxShadow = "0 15px 35px rgba(37, 99, 235, 0.4), 0 0 20px rgba(37, 99, 235, 0.3)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(37, 99, 235, 0.3), 0 0 15px rgba(37, 99, 235, 0.2)";
                                }}
                            >
                                {loading ? "Starting..." : "Start Interview"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "15px" }}>
                        <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>📊 Interview History</h1>
                        {historyLoading ? (
                            <div style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>Loading history...</div>
                        ) : pastInterviews.length === 0 ? (
                            <div style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>
                                No past interviews yet. Start your first interview!
                            </div>
                        ) : (
                            <div style={{ display: "grid", gap: "15px" }}>
                                {pastInterviews.map((interview, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            background: "#1e293b",
                                            padding: "20px",
                                            borderRadius: "12px",
                                            border: "1px solid rgba(59,130,246,0.2)",
                                            boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: "18px", color: "#60a5fa" }}>
                                                    {interview.role?.toUpperCase()} Interview
                                                </h3>
                                                <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>
                                                    {new Date(interview.date).toLocaleDateString()} {new Date(interview.date).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <div style={{
                                                    fontSize: "24px",
                                                    fontWeight: "bold",
                                                    color: interview.totalScore / interview.questions.length >= 7 ? "#86efac" : interview.totalScore / interview.questions.length >= 5 ? "#fbbf24" : "#f87171"
                                                }}>
                                                    {(interview.totalScore / interview.questions.length).toFixed(1)}/10
                                                </div>
                                                <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>
                                                    {interview.questions.length} questions
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid rgba(59,130,246,0.2)" }}>
                                            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px" }}>Questions:</p>
                                            {interview.questions.map((q, qIdx) => (
                                                <div key={qIdx} style={{ fontSize: "13px", color: "#d1d5db", marginBottom: "6px", paddingLeft: "10px", borderLeft: "2px solid #3b82f6" }}>
                                                    Q{qIdx + 1}: {q.question?.substring(0, 70)}...
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#0b1120", color: "white", padding: "20px", overflow: "visible", display: "flex", flexDirection: "column", gap: "15px", width: "100%", boxSizing: "border-box" }}>
            {/* Header with Progress */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", gap: "10px", flexWrap: "wrap" }}>
                <h1 style={{ margin: 0, fontSize: "clamp(22px, 4vw, 24px)" }}>🎤 Mock Interview - {role.toUpperCase()}</h1>
                <div style={{ fontSize: "14px", color: "#94a3b8" }}>
                    Questions: {interviewHistory.length} | Avg Score: {interviewHistory.length > 0 ? (totalScore / interviewHistory.length).toFixed(1) : 0}/10
                </div>
            </div>

            {/* Interview History */}
            {interviewHistory.length > 0 && (
                <div style={{
                    background: "#0f172a",
                    padding: "15px",
                    borderRadius: "8px",
                    borderLeft: "3px solid #3b82f6"
                }}>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 10px 0" }}>📝 Interview History</p>
                    {interviewHistory.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: "10px", fontSize: "13px", paddingBottom: "10px", borderBottom: "1px solid rgba(59,130,246,0.2)" }}>
                            <div style={{ color: "#60a5fa", fontWeight: "500" }}>Q{idx + 1}: {item.question.substring(0, 60)}...</div>
                            <div style={{ color: "#86efac", marginTop: "4px" }}>Score: {item.feedback.score}/10</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Current Question */}
            <div style={{ background: "#1e293b", padding: "15px", borderRadius: "8px", boxShadow: "0 10px 25px rgba(0,0,0,0.3), 0 0 15px rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "8px", margin: 0, color: "#60a5fa" }}>Question {interviewHistory.length + 1}:</h3>
                <p style={{ margin: 0, lineHeight: "1.4", fontSize: "15px" }}>{question}</p>
            </div>

            {/* Answer Input */}
            {!feedback && (
                <>
                    <textarea
                        rows="6"
                        placeholder="Write your answer here..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={loading}
                        style={{
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #3b82f6",
                            background: "#0f172a",
                            color: "white",
                            fontSize: "14px",
                            resize: "none",
                            fontFamily: "Arial, sans-serif",
                            boxShadow: "0 8px 20px rgba(59,130,246,0.2), inset 0 1px 3px rgba(255,255,255,0.1)",
                            transition: "all 0.3s ease",
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? "not-allowed" : "text",
                            minHeight: "150px",
                            boxSizing: "border-box"
                        }}
                        onFocus={(e) => {
                            if (!loading) {
                                e.currentTarget.style.boxShadow = "0 12px 30px rgba(59,130,246,0.3), inset 0 1px 3px rgba(255,255,255,0.1)";
                                e.currentTarget.style.borderColor = "#60a5fa";
                            }
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(59,130,246,0.2), inset 0 1px 3px rgba(255,255,255,0.1)";
                            e.currentTarget.style.borderColor = "#3b82f6";
                        }}
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !answer.trim()}
                        style={{
                            padding: "12px 20px",
                            background: loading || !answer.trim() ? "#475569" : "#3b82f6",
                            color: "white",
                            border: loading || !answer.trim() ? "none" : "1px solid rgba(59,130,246,0.5)",
                            borderRadius: "8px",
                            cursor: loading || !answer.trim() ? "not-allowed" : "pointer",
                            fontWeight: "bold",
                            fontSize: "16px",
                            boxShadow: loading || !answer.trim() ? "none" : "0 10px 25px rgba(59,130,246,0.3), 0 0 15px rgba(59,130,246,0.2)",
                            transition: "all 0.3s ease",
                            opacity: loading || !answer.trim() ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!loading && answer.trim()) {
                                e.currentTarget.style.transform = "translateY(-3px)";
                                e.currentTarget.style.boxShadow = "0 15px 35px rgba(59,130,246,0.4), 0 0 20px rgba(59,130,246,0.3)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 10px 25px rgba(59,130,246,0.3), 0 0 15px rgba(59,130,246,0.2)";
                        }}
                    >
                        {loading ? "Evaluating..." : "Submit Answer"}
                    </button>
                </>
            )}

            {/* Feedback */}
            {feedback && (
                <div style={{
                    background: "#1e1e1e",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.4), 0 0 20px rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.2)"
                }}>
                    <h3 style={{ textAlign: "center", color: "#86efac", marginTop: 0 }}>✓ AI Feedback</h3>

                    <div style={{ marginBottom: "15px" }}>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: feedback.score >= 7 ? "#86efac" : feedback.score >= 5 ? "#fbbf24" : "#f87171" }}>
                            Score: {feedback.score}/10
                        </div>
                    </div>

                    <p style={{ lineHeight: "1.6", marginBottom: "15px" }}>
                        <strong>Feedback:</strong> {feedback.feedback}
                    </p>

                    {feedback.improvementPoints && feedback.improvementPoints.length > 0 && (
                        <div>
                            <strong>Areas to Improve:</strong>
                            <ul style={{ marginTop: "8px", paddingLeft: "20px", lineHeight: "1.8" }}>
                                {feedback.improvementPoints.map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
                        <button
                            onClick={getNextQuestion}
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: "12px 20px",
                                background: loading ? "#475569" : "#2563eb",
                                color: "white",
                                border: loading ? "none" : "1px solid rgba(37, 99, 235, 0.5)",
                                borderRadius: "8px",
                                cursor: loading ? "not-allowed" : "pointer",
                                fontWeight: "bold",
                                boxShadow: loading ? "none" : "0 10px 25px rgba(37, 99, 235, 0.3), 0 0 15px rgba(37, 99, 235, 0.2)",
                                transition: "all 0.3s ease",
                                opacity: loading ? 0.6 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = "translateY(-3px)";
                                    e.currentTarget.style.boxShadow = "0 15px 35px rgba(37, 99, 235, 0.4), 0 0 20px rgba(37, 99, 235, 0.3)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 10px 25px rgba(37, 99, 235, 0.3), 0 0 15px rgba(37, 99, 235, 0.2)";
                            }}
                        >
                            {loading ? "Loading..." : "Next Question →"}
                        </button>

                        <button
                            onClick={endInterview}
                            style={{
                                flex: 1,
                                padding: "12px 20px",
                                background: "#475569",
                                color: "white",
                                border: "1px solid rgba(71, 85, 105, 0.5)",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                boxShadow: "0 10px 25px rgba(71, 85, 105, 0.2)",
                                transition: "all 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-3px)";
                                e.currentTarget.style.boxShadow = "0 15px 35px rgba(71, 85, 105, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 10px 25px rgba(71, 85, 105, 0.2)";
                            }}
                        >
                            End Interview
                        </button>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}
