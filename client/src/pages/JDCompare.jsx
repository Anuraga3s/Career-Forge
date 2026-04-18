import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; 
export default function JDCompare() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");

  const [savedJDs, setSavedJDs] = useState([]);
  const [selectedJD, setSelectedJD] = useState("");

  const [jdFile, setJdFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
    fetchJDs();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.get("/resume/all");
      setResumes(response.data);
      if (response.data.length > 0) {
        setSelectedResume(response.data[0]._id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchJDs = async () => {
    try {
      const response = await api.get("/job/all");
      setSavedJDs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompare = async () => {
  try {
    setLoading(true);

    let jdText = jobDescription;
    let jdTitle = "Pasted JD";

    // If saved JD selected
    if (selectedJD) {
      const jdResponse = await api.get(
        `/job/${selectedJD}`
      );

      jdText =
        jdResponse.data.jobDescription;

      jdTitle =
        jdResponse.data.fileName ||
        jdResponse.data.role;
    }

    // If new JD file uploaded
    if (jdFile) {
      const formData = new FormData();
      formData.append("file", jdFile);

      const uploadResponse =
        await api.post(
          "/job/upload",
          formData
        );

      jdText =
        uploadResponse.data.jobDescription;

      jdTitle =
        uploadResponse.data.fileName;
    }

    // Validation: Check if JD text is provided
    if (!jdText || jdText.trim() === "") {
      alert("Please provide a Job Description by:\n1. Pasting JD text in Step 2, OR\n2. Selecting a saved JD in Step 3, OR\n3. Uploading a JD file in Step 4");
      setLoading(false);
      return;
    }

    // Validation: Check if resume is selected
    if (!selectedResume) {
      alert("Please select a resume in Step 1");
      setLoading(false);
      return;
    }

    // Get the selected resume object to extract stream
    const selectedResumeData = resumes.find((r) => r._id === selectedResume);
    const stream = selectedResumeData?.stream || "CSE";

    const response =
      await api.post(
        "/job/compare",
        {
          resumeId:
            selectedResume,
          jobDescription:
            jdText,
          jdTitle,
          stream,
        }
      );

    setResult(response.data);
  } catch (error) {
    console.error(error);
    const errorMsg = error.response?.data?.message || 
                     error.response?.data?.error || 
                     error.message || 
                     "Comparison failed. Please try again.";
    alert("Error: " + errorMsg);
  } finally {
    setLoading(false);
  }
};

  // --- STYLES ---
  const theme = {
    bg: "#0B1120",
    cardBg: "rgba(30, 41, 59, 0.4)",
    cardBorder: "1px solid rgba(56, 189, 248, 0.2)",
    inputBg: "rgba(15, 23, 42, 0.6)",
    inputBorder: "1px solid rgba(56, 189, 248, 0.3)",
    accent: "#3B82F6",
    textMain: "#F8FAFC",
    textMuted: "#94A3B8",
  };

  const cardStyle = {
    background: theme.cardBg,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: theme.cardBorder,
    padding: "14px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    minWidth: 0,
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: theme.inputBorder,
    background: theme.inputBg,
    color: theme.textMain,
    outline: "none",
    fontSize: "13px",
    boxSizing: "border-box",
  };

  const fileCardStyle = (isSelected) => ({
    minWidth: "140px",
    padding: "16px",
    borderRadius: "12px",
    background: isSelected ? theme.accent : "rgba(30, 41, 59, 0.6)",
    border: isSelected ? `1px solid ${theme.accent}` : theme.inputBorder,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    transition: "all 0.2s ease",
  });

  const canCompare =
    selectedResume &&
    (jobDescription.trim() || selectedJD || jdFile);

  const activeJDSource = selectedJD
    ? "Saved JD selected"
    : jdFile
      ? "JD file uploaded"
      : jobDescription.trim()
        ? "Manual JD text added"
        : "No JD source yet";

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "12px 14px",
        color: theme.textMain,
        background: `radial-gradient(circle at top right, #1E293B, ${theme.bg})`,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "visible",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        
        <h1 style={{ fontSize: "22px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: theme.accent }}>🔄</span> Resume vs JD Compare
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "10px",
            width: "100%",
            alignItems: "start",
          }}
        >
          
          {/* STEP 1: Select Resume */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "500" }}>Step 1: Select Resume</h3>
              <span style={{ color: theme.accent }}>📄</span>
            </div>

            <select
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              style={inputStyle}
            >
              <option value="" disabled>Select a resume from database...</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.fileName}
                </option>
              ))}
            </select>

            {/* Visual Recently Used (Mockup feature mapped to your state) */}
              <div style={{ marginTop: "4px" }}>
                <p style={{ fontSize: "12px", color: theme.textMuted, marginBottom: "10px" }}>Available Resumes</p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  overflowX: "auto",
                  overflowY: "hidden",
                  paddingBottom: "8px",
                  width: "100%",
                  flexWrap: "nowrap",
                  scrollbarWidth: "thin",
                }}
              >
                {resumes.length === 0 ? (
                  <p style={{ fontSize: "12px", color: theme.textMuted }}>No resumes found.</p>
                ) : (
                  resumes.map((resume) => (
                    <div 
                      key={resume._id}
                      onClick={() => setSelectedResume(resume._id)}
                      style={{
                        ...fileCardStyle(selectedResume === resume._id),
                        flex: "0 0 220px",
                        maxWidth: "220px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 8px", borderRadius: "4px", fontSize: "10px" }}>PDF</span>
                        {selectedResume === resume._id && <span style={{ fontSize: "10px", background: "#10B981", padding: "2px 6px", borderRadius: "4px" }}>✓ Selected</span>}
                      </div>
                      <p style={{ margin: "8px 0 0 0", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {resume.fileName}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* STEP 2: Paste JD */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "500" }}>Step 2: Paste Job Description</h3>
              <span style={{ color: theme.accent }}>📋</span>
            </div>

            <div style={{ position: "relative" }}>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Begin by pasting or typing the full Job Description here..."
                style={{
                  ...inputStyle,
                  resize: "none",
                    height: "96px",
                    paddingBottom: "25px",
                  }}
                />
              <span style={{ 
                position: "absolute", 
                bottom: "10px", 
                right: "12px", 
                fontSize: "12px", 
                color: theme.textMuted 
              }}>
                {jobDescription.length} / 10000 chars
              </span>
            </div>
          </div>

          {/* STEP 3: Saved JD */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "500" }}>Step 3: Select Saved JD (Optional)</h3>
              <span style={{ color: theme.accent }}>📁</span>
            </div>

            <select
              value={selectedJD}
              onChange={(e) => setSelectedJD(e.target.value)}
              style={inputStyle}
            >
              <option value="">Type to search past JDs...</option>
              {savedJDs.map((jd) => (
                <option key={jd._id} value={jd._id}>
                  {jd.role || "Saved Job Description"}
                </option>
              ))}
            </select>
          </div>

          {/* STEP 4: Upload New JD */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "500" }}>Step 4: Upload New JD (Optional)</h3>
              <span style={{ color: theme.accent }}>📎</span>
            </div>

            <div style={{
              border: `2px dashed ${theme.textMuted}`,
              borderRadius: "12px",
              padding: "22px",
              textAlign: "center",
              position: "relative",
              cursor: "pointer",
              background: "rgba(15, 23, 42, 0.3)",
              transition: "all 0.2s",
            }}>
              <input
                type="file"
                onChange={(e) => setJdFile(e.target.files[0])}
                style={{
                  opacity: 0,
                  position: "absolute",
                  top: 0, left: 0, right: 0, bottom: 0,
                  width: "100%", height: "100%",
                  cursor: "pointer"
                }}
              />
              <div style={{ pointerEvents: "none" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px", color: theme.accent }}>☁️</div>
                {jdFile ? (
                  <p style={{ margin: 0, color: theme.textMain }}>{jdFile.name}</p>
                ) : (
                  <p style={{ margin: 0, color: theme.textMuted, fontSize: "14px" }}>Click or drag file to upload JD</p>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              ...cardStyle,
              gridColumn: "span 2",
              background: "linear-gradient(135deg, rgba(30,41,59,0.78), rgba(59,130,246,0.10))",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <div>
                <p style={{ margin: "0 0 4px 0", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: theme.textMuted }}>
                  Comparison Snapshot
                </p>
                <h3 style={{ margin: 0, fontSize: "17px" }}>
                  {canCompare ? "Ready to compare" : "Complete the required inputs"}
                </h3>
              </div>
              <span style={{ fontSize: "24px" }}>{canCompare ? "✅" : "🧭"}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
              <div style={{ padding: "10px 12px", borderRadius: "12px", background: "rgba(15,23,42,0.42)", border: "1px solid rgba(56,189,248,0.14)" }}>
                <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: theme.textMuted }}>Resume</p>
                <p style={{ margin: 0, fontSize: "13px" }}>{selectedResume ? "Selected" : "Not selected"}</p>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: "12px", background: "rgba(15,23,42,0.42)", border: "1px solid rgba(56,189,248,0.14)" }}>
                <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: theme.textMuted }}>JD Source</p>
                <p style={{ margin: 0, fontSize: "13px" }}>{activeJDSource}</p>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: "12px", background: "rgba(15,23,42,0.42)", border: "1px solid rgba(56,189,248,0.14)" }}>
                <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: theme.textMuted }}>Expected Output</p>
                <p style={{ margin: 0, fontSize: "13px" }}>Match score, gaps, roadmap</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCompare}
          disabled={loading || !canCompare}
          style={{
            marginTop: "14px",
            padding: "14px 28px",
            borderRadius: "12px",
            background: (loading || !canCompare) ? "#475569" : theme.accent,
            color: "white",
            border: "none",
            fontSize: "16px",
            cursor: (loading || !canCompare) ? "not-allowed" : "pointer",
            fontWeight: "600",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.35)",
            transition: "all 0.3s ease",
            opacity: (loading || !canCompare) ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!(loading || !canCompare)) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 14px 36px rgba(59, 130, 246, 0.45)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(59, 130, 246, 0.35)";
          }}
          title={
            !selectedResume ? "Please select a resume first" :
            (!jobDescription && !selectedJD && !jdFile) ? "Please provide a Job Description (paste, select saved, or upload)" :
            "Click to compare resume with JD"
          }
        >
          ⚙️ {loading ? "Analyzing Match..." : "Initiate Comparison"}
        </button>

        {/* Results Section */}
        {result && (
          <div
            style={{
              marginTop: "30px",
              background: theme.cardBg,
              backdropFilter: "blur(12px)",
              border: theme.cardBorder,
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Match Score */}
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>📊 Match Score</h2>
              <div style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: result.analysis?.matchScore >= 70 ? "#10B981" : result.analysis?.matchScore >= 50 ? "#F59E0B" : "#EF4444",
              }}>
                {result.analysis?.matchScore || 0}%
              </div>
            </div>

            {/* Matched Skills */}
            {result.analysis?.matchedSkills && result.analysis.matchedSkills.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#10B981" }}>✓ Matched Skills</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {result.analysis.matchedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: "rgba(16, 185, 129, 0.2)",
                        border: "1px solid #10B981",
                        color: "#10B981",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {result.analysis?.missingSkills && result.analysis.missingSkills.length > 0 ? (
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#EF4444" }}>⚠️ Missing Skills (Focus on these)</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {result.analysis.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: "rgba(239, 68, 68, 0.2)",
                        border: "1px solid #EF4444",
                        color: "#FCA5A5",
                        padding: "8px 14px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: "24px", background: "rgba(16, 185, 129, 0.1)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                <p style={{ margin: 0, color: "#10B981", fontSize: "14px" }}>
                  ✨ Great! You have all the required skills for this role!
                </p>
              </div>
            )}

            {/* Suggestions */}
            <div style={{ marginBottom: "24px", background: "rgba(59, 130, 246, 0.1)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "12px", color: theme.accent }}>💡 Suggestion</h3>
              <p style={{ margin: 0, lineHeight: "1.6" }}>
                {result.analysis?.suggestions || "Focus on missing skills and complete the roadmap topics to improve your match score."}
              </p>
            </div>

            {/* View Roadmap Button */}
            {result.roadmap && (
              <button
                onClick={() => navigate(`/roadmap/${result.roadmap._id}`)}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: theme.accent,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.background = "#2563EB"}
                onMouseLeave={(e) => e.target.style.background = theme.accent}
              >
                📚 View Learning Roadmap
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
