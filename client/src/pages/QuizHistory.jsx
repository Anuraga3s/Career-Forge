import { useEffect, useState } from "react";
import api from "../services/api";

export default function QuizHistory() {
  const [history, setHistory] =
    useState([]);

  const fetchHistory =
    async () => {
      try {
        const response =
          await api.get(
            "/quiz/history"
          );

        setHistory(
          response.data
        );
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    fetchHistory();
  }, []);

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
      <h1 style={{ marginBottom: "20px", fontSize: "24px" }}>Quiz History</h1>

      {history.map(
        (quiz, index) => (
          <div
            key={quiz._id}
            style={{
              marginTop:
                "20px",
              background:
                "#1e293b",
              padding:
                "20px",
              borderRadius:
                "16px",
              boxShadow:
                "0 15px 35px rgba(0,0,0,0.4), 0 0 20px rgba(59,130,246,0.1)",
              border:
                "1px solid rgba(59,130,246,0.2)",
              transition:
                "all 0.3s ease",
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
            <h3>
              Attempt{" "}
              {index + 1}
            </h3>
            <p>
              Subject:{" "}
              {
                quiz.subject
              }
            </p>
            <p>
              Score:{" "}
              {quiz.score}
              /
              {
                quiz.totalQuestions
              }
            </p>

            <p>
              Percentage:{" "}
              {Math.round(
                (quiz.score /
                  quiz.totalQuestions) *
                  100
              )}
              %
            </p>

            <div style={{ marginTop: "12px", background: "rgba(220,38,38,0.1)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(220,38,38,0.2)" }}>
  <h4 style={{ color: "#f87171", marginTop: 0 }}>Wrong Questions - Need more practice</h4>

  {quiz.weakTopics?.length > 0 ? (
    <ul
      style={{
        marginTop: "10px",
        paddingLeft: "20px",
        lineHeight: "1.8",
      }}
    >
      {quiz.weakTopics.map(
        (topic, index) => (
          <li key={index}>
            {topic}
          </li>
        )
      )}
    </ul>
  ) : (
    <p style={{ color: "#86efac" }}>Every Effort Matters</p>
  )}
</div>
          </div>
        )
      )}
    </div>
  );
}
