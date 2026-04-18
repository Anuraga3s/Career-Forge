import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function RoadmapDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);

  const fetchRoadmap = useCallback(async () => {
    try {
      const response = await api.get(`/roadmap/${id}`);
      setRoadmap(response.data.roadmap);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);
  const createQuiz = async () => {
  try {
    const response = await api.post("/quiz/create", {
      roadmapId: id,
    });

    navigate(`/quiz/${response.data._id}`);
  } catch (error) {
    console.error(error);
  }
};



  const handleTopicClick = async (topic) => {
    try {
      await api.post("/progress/update-topic", {
        roadmapId: id,
        topic,
      });

      fetchRoadmap();
    } catch (error) {
      console.error(error);
    }
  };

  if (!roadmap) return <h2>Loading...</h2>;
  const handleSubjectQuiz = async (
  subject
) => {
  try {
    const response =
      await api.post(
        "/quiz/create-subject",
        {
          roadmapId: id,
          subject,
        }
      );

    navigate(
      `/quiz/${response.data._id}`
    );
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        color: "white",
        background: "#0b1120",
        overflow: "visible",
        boxSizing: "border-box",
      }}
    >
      {/* role heading */}
      <h1>{roadmap.role}</h1>
      <div
        style={{
          marginTop: "25px",
          background: "#1e293b",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.4), 0 0 20px rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        <h2>Roadmap Progress</h2>

        <progress
          value={
            roadmap?.completedTopics?.length
              ? Math.round(
                  (roadmap.completedTopics.length /
                    Object.values(roadmap.roadmap || {}).reduce(
                      (acc, curr) => acc + curr.topics.length,
                      0,
                    )) *
                    100,
                )
              : 0
          }
          max="100"
          style={{
            width: "100%",
            marginTop: "15px",
            height: "18px",
          }}
        />

        <p style={{ marginTop: "10px" }}>
          {roadmap?.completedTopics?.length || 0}/
          {Object.values(roadmap?.roadmap || {}).reduce(
            (acc, curr) => acc + curr.topics.length,
            0,
          )}{" "}
          topics completed
        </p>
      </div>

      {/* match score */}
      <h2
        style={{
          marginTop: "20px",
        }}
      >
        Match Score: {roadmap.matchScore}%
      </h2>

      <div
  style={{
    marginTop: "20px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #dc2626",
    boxShadow: "0 15px 35px rgba(220,38,38,0.2), 0 0 20px rgba(220,38,38,0.1)",
  }}
>
  <h3
    style={{
      marginBottom: "12px",
      color: "#f87171",
    }}
  >
    Missing Skills
  </h3>

  {roadmap?.missingSkills?.length > 0 ? (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
    }}
  >
    {roadmap.missingSkills.map(
      (skill, index) => (
        <span
          key={index}
          style={{
            background: "rgba(220,38,38,0.2)",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #dc2626",
            color: "#fca5a5",
          }}
        >
          {skill}
        </span>
      )
    )}
  </div>
) : (
  <p>No missing skills 🎉</p>
)}
</div>

      {/* suggestions */}
      <div
        style={{
          marginTop: "30px",
          background: "#1e293b",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.4), 0 0 20px rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        <h2>AI Suggestions</h2>

        <ul
          style={{
            marginTop: "15px",
            lineHeight: "2",
          }}
        >
          {roadmap?.suggestions?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <button
          onClick={createQuiz}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            borderRadius: "10px",
            background: "#2563eb",
            color: "white",
            border: "1px solid rgba(37, 99, 235, 0.5)",
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3), 0 0 15px rgba(37, 99, 235, 0.2)",
            transition: "all 0.3s ease",
            fontWeight: "bold",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(37, 99, 235, 0.4), 0 0 20px rgba(37, 99, 235, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(37, 99, 235, 0.3), 0 0 15px rgba(37, 99, 235, 0.2)";
          }}
        >
          Take Quiz
        </button>
      </div>

      {/* learning roadmap */}
      <div
        style={{
          marginTop: "40px",
        }}
      >
        <h2>Learning Roadmap</h2>

        <div
          style={{
            marginTop: "40px",
          }}
        >
          {Object.entries(roadmap?.roadmap || {}).map(([subject, details]) => (
            <div
              key={subject}
              style={{
                marginTop: "25px",
                background: "#1e293b",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.4), 0 0 20px rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 45px rgba(59,130,246,0.3), 0 0 25px rgba(59,130,246,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.4), 0 0 20px rgba(59,130,246,0.1)";
              }}
            >
              <h3>{subject.toUpperCase()}</h3>

              <button
  onClick={() =>
    handleSubjectQuiz(subject)
  }
  style={{
    marginTop: "10px",
    marginBottom: "15px",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid rgba(59,130,246,0.5)",
    background: "#1d4ed8",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(59,130,246,0.2)",
    transition: "all 0.3s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 12px 30px rgba(59,130,246,0.3)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(59,130,246,0.2)";
  }}
>
  Take {subject} Quiz
</button>

              <progress
                value={details.progress || 0}
                max="100"
                style={{
                  width: "100%",
                  marginTop: "15px",
                }}
              />

              <ul
                style={{
                  marginTop: "15px",
                  lineHeight: "2",
                }}
              >
                {details.topics?.map((topic, index) => (
                  <li key={index}>
                    <input
                      type="checkbox"
                      checked={roadmap?.completedTopics?.includes(topic)}
                      onChange={() => handleTopicClick(topic)}
                      style={{
                        marginRight: "10px",
                      }}
                    />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
