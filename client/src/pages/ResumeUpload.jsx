import { useState } from "react";
import api from "../services/api";

export default function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [stream, setStream] = useState("CSE");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a resume file");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("resume", file);
            formData.append("stream", stream);

            const response = await api.post(
                "/resume/upload",
                formData
            );

            setResult(response.data.resume);
            alert("Resume uploaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Upload failed: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", padding: "20px", overflow: "visible", background: "#0b1120", color: "white", display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" }}>
            <h1 style={{ marginBottom: "10px", fontSize: "28px" }}>AI Placement Coach</h1>
            <h2 style={{ marginBottom: "20px", fontSize: "18px" }}>Resume Upload</h2>

            <div style={{ background: "#1e293b", padding: "30px", borderRadius: "12px", maxWidth: "500px", width: "100%", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
                <label style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "10px", display: "block" }}>
                    Select Your Academic Stream:
                </label>
                <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
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
                    <option value="CSE">Computer Science & Engineering (CSE)</option>
                    <option value="Civil">Civil Engineering</option>
                    <option value="Mechanical">Mechanical Engineering</option>
                    <option value="MDS">Management & Data Science (MDS)</option>
                </select>

                <label style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "10px", display: "block" }}>
                    Select Resume File:
                </label>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                        setFile(e.target.files[0])
                    }
                    style={{
                        padding: "10px",
                        color: "white",
                        width: "100%",
                        background: "#0f172a",
                        border: "1px solid #3b82f6",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(59,130,246,0.15)",
                        boxSizing: "border-box",
                        marginBottom: "20px",
                        cursor: "pointer"
                    }}
                />

                <button
                    onClick={handleUpload}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: loading ? "#475569" : "#3b82f6",
                        color: "white",
                        border: loading ? "none" : "1px solid rgba(59,130,246,0.5)",
                        borderRadius: "8px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        boxShadow: loading ? "none" : "0 10px 25px rgba(59,130,246,0.3), 0 0 15px rgba(59,130,246,0.2)",
                        transition: "all 0.3s ease",
                        opacity: loading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow = "0 15px 35px rgba(59,130,246,0.4), 0 0 20px rgba(59,130,246,0.3)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 10px 25px rgba(59,130,246,0.3), 0 0 15px rgba(59,130,246,0.2)";
                    }}
                >
                    {loading ? "Uploading..." : "Upload Resume"}
                </button>
            </div>

            {result && (
                <div style={{ marginTop: "30px", background: "#1e293b", padding: "20px", borderRadius: "12px", maxWidth: "600px", width: "100%", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
                    <h3 style={{ color: "#60a5fa", marginTop: 0 }}>Analysis Results</h3>
                    
                    <div style={{ marginBottom: "15px" }}>
                        <p style={{ margin: "5px 0", color: "#94a3b8" }}>
                            <strong>Stream:</strong> <span style={{ color: "#86efac" }}>{result.stream}</span>
                        </p>
                        <p style={{ margin: "5px 0", color: "#94a3b8" }}>
                            <strong>ATS Score:</strong> <span style={{ color: result.atsScore >= 70 ? "#86efac" : result.atsScore >= 50 ? "#fbbf24" : "#f87171", fontSize: "18px", fontWeight: "bold" }}>{result.atsScore}/100</span>
                        </p>
                    </div>

                    {result.detectedSkills && result.detectedSkills.length > 0 && (
                        <div style={{ marginBottom: "15px" }}>
                            <p style={{ color: "#94a3b8", marginBottom: "8px" }}><strong>Detected Skills:</strong></p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {result.detectedSkills.slice(0, 10).map((skill, idx) => (
                                    <span key={idx} style={{ background: "#3b82f6", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>
                                        {skill}
                                    </span>
                                ))}
                                {result.detectedSkills.length > 10 && <span style={{ color: "#94a3b8", fontSize: "12px" }}>+{result.detectedSkills.length - 10} more</span>}
                            </div>
                        </div>
                    )}

                    {result.strengths && result.strengths.length > 0 && (
                        <div style={{ marginBottom: "15px" }}>
                            <p style={{ color: "#86efac", marginBottom: "8px" }}><strong>✓ Strengths:</strong></p>
                            <ul style={{ margin: "0", paddingLeft: "20px", color: "#d1d5db" }}>
                                {result.strengths.map((strength, idx) => (
                                    <li key={idx} style={{ marginBottom: "4px" }}>{strength}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {result.weaknesses && result.weaknesses.length > 0 && (
                        <div style={{ marginBottom: "15px" }}>
                            <p style={{ color: "#f87171", marginBottom: "8px" }}><strong>✗ Weaknesses:</strong></p>
                            <ul style={{ margin: "0", paddingLeft: "20px", color: "#d1d5db" }}>
                                {result.weaknesses.map((weakness, idx) => (
                                    <li key={idx} style={{ marginBottom: "4px" }}>{weakness}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {result.suggestions && result.suggestions.length > 0 && (
                        <div>
                            <p style={{ color: "#fbbf24", marginBottom: "8px" }}><strong>💡 Suggestions:</strong></p>
                            <ul style={{ margin: "0", paddingLeft: "20px", color: "#d1d5db" }}>
                                {result.suggestions.map((suggestion, idx) => (
                                    <li key={idx} style={{ marginBottom: "4px" }}>{suggestion}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
