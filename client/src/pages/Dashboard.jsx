import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const formatSkill = (skill = "") =>
    skill
      .split(/[\s_-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");

  const fetchDashboard = async () => {
  try {
    const token = localStorage.getItem("token");

    //console.log("Manual token:", token);

    const response = await api.get(
      "/dashboard/summary",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setData(response.data);
  } catch (error) {
    console.error(
      "Dashboard fetch error:",
      error.response?.data || error
    );
  }
};

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!data) {
    return <h2 style={{ color: "white", padding: "30px" }}>Loading...</h2>;
  }

  const cardStyle = {
    background: "linear-gradient(135deg, #1e293b, #0f172a)",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.1)",
    minHeight: "110px",
    textAlign: "center",
    border: "1px solid rgba(59,130,246,0.2)",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
    transform: "translateZ(0)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1120",
        color: "white",
        padding: "20px",
        overflow: "visible",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          marginBottom: "20px",
        }}
      >
        Student Dashboard
      </h1>

      {/* TOP CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <div style={cardStyle} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.6), 0 0 30px rgba(59,130,246,0.3)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateZ(0)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.1)"; }}>
          <h3>ATS Score</h3>
          <h1>{data?.atsScore || 0}%</h1>
        </div>

        <div style={cardStyle} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.6), 0 0 30px rgba(59,130,246,0.3)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateZ(0)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.1)"; }}>
          <h3>Interview Score</h3>
          <h1>{data?.interviewScore || 0}/10</h1>
        </div>

        <div style={cardStyle} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.6), 0 0 30px rgba(59,130,246,0.3)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateZ(0)"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.1)"; }}>
          <h3>Skills</h3>
          <p>{data?.skills?.map(formatSkill).join(", ") || "No skills"}</p>
        </div>
      </div>

      {/* ANALYTICS */}
      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "15px",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            borderRadius: "16px",
            padding: "20px",
            minHeight: "250px",
            minWidth: 0,
          }}
        >
          <h2>Overall Progress</h2>

          <div style={{ marginTop: "20px" }}>
            <p style={{ fontSize: "14px", marginBottom: "10px" }}>ATS Resume Score: {data?.atsScore || 0}%</p>
            <progress
              value={data?.atsScore || 0}
              max="100"
              style={{
                width: "100%",
                height: "20px",
                borderRadius: "10px",
                appearance: "none",
                backgroundColor: "#0f172a",
              }}
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <p style={{ fontSize: "14px", marginBottom: "10px" }}>Interview Score: {data?.interviewScore || 0}/10</p>
            <progress
              value={data?.interviewScore || 0}
              max="10"
              style={{
                width: "100%",
                height: "20px",
                borderRadius: "10px",
                appearance: "none",
                backgroundColor: "#0f172a",
              }}
            />
          </div>
        </div>

        <div
          style={{
            background: "#1e293b",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            minWidth: 0,
          }}
        >
          <h2>Success Rate</h2>

          <div
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              border: "10px solid #3b82f6",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "30px auto",
              fontSize: "30px",
              fontWeight: "bold",
            }}
          >
            {data?.atsScore || 0}%
          </div>
        </div>
      </div>

      {/* ROLE PROGRESS */}
      <div style={{ marginTop: "50px" }}>
        <h2>Role Progress</h2>

        <div
          style={{
            display: "grid",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {data?.roadmaps?.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/roadmap/${item._id}`)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                padding: "25px",
                borderRadius: "20px",
                cursor: "pointer",
                background: "linear-gradient(135deg,#1e293b,#0f172a)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                transition: "0.3s",
              }}
            >
              <div>
                <h3 style={{ wordBreak: "break-word" }}>{item.role}</h3>
                <p>Match Score: {item.matchScore}%</p>
              </div>

              {/* circular progress */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: "6px solid #3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                {item.matchScore}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
