import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function QuizPage() {
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quiz/${id}`);
      setQuiz(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOptionSelect = (
    questionIndex,
    option
  ) => {
    setAnswers({
      ...answers,
      [questionIndex]: option,
    });
  };

  const submitQuiz = async () => {
    let score = 0;
    let weakTopics = [];

    quiz.questions.forEach(
      (question, index) => {
        if (
          answers[index] ===
          question.correctAnswer
        ) {
          score++;
        } else {
          weakTopics.push(
            question.question
          );
        }
      }
    );

    const percentage = Math.round(
      (score /
        quiz.questions.length) *
        100
    );

    setResult({
      score,
      percentage,
      weakTopics,
    });

    await api.post("/quiz/submit", {
      quizId: id,
      score,
      weakTopics,
    });
  };

  if (!quiz)
    return (
      <h2 style={{ color: "white" }}>
        Loading quiz...
      </h2>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        overflow: "visible",
        padding: "20px",
        color: "white",
        background: "#0b1120",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ marginBottom: "20px", fontSize: "28px" }}>{quiz.subject} Quiz</h1>

      {quiz.questions.map(
        (q, index) => (
          <div
            key={index}
            style={{
              marginTop: "25px",
              background:
                "#1e293b",
              padding: "20px",
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
              Q{index + 1}.{" "}
              {q.question}
            </h3>

            {q.options.map(
              (option, i) => (
                <div
                  key={i}
                  style={{
                    marginTop:
                      "10px",
                    background:
                      answers[index] === option ? "rgba(59,130,246,0.2)" : "transparent",
                    padding: "8px",
                    borderRadius: "6px",
                    border:
                      answers[index] === option ? "1px solid #3b82f6" : "1px solid transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  <label style={{ cursor: "pointer" }}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={
                        option
                      }
                      checked={
                        answers[
                          index
                        ] ===
                        option
                      }
                      onChange={() =>
                        handleOptionSelect(
                          index,
                          option
                        )
                      }
                      style={{
                        marginRight:
                          "10px",
                      }}
                    />
                    {option}
                  </label>
                </div>
              )
            )}
          </div>
        )
      )}

      <button
        onClick={submitQuiz}
        style={{
          marginTop: "30px",
          padding:
            "12px 20px",
          background:
            "#2563eb",
          border: "1px solid rgba(37, 99, 235, 0.5)",
          color: "white",
          borderRadius:
            "10px",
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
        Submit Quiz
      </button>

      {result && (
        <div
          style={{
            marginTop: "30px",
            background:
              "#1e293b",
            padding: "20px",
            borderRadius:
              "16px",
            boxShadow:
              "0 15px 35px rgba(0,0,0,0.4), 0 0 20px rgba(34,197,94,0.1)",
            border:
              "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <h2 style={{ color: "#86efac" }}>
            Score:{" "}
            {result.score}/
            {
              quiz.questions
                .length
            }
          </h2>
          <h3 style={{ color: "#86efac" }}>
            {
              result.percentage
            }
            %
          </h3>

          <h3>
            AI Suggestions
          </h3>

          <ul style={{ lineHeight: "1.8" }}>
            {result.weakTopics.map(
              (
                topic,
                index
              ) => (
                <li
                  key={
                    index
                  }
                >
                  Revise:{" "}
                  {topic}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
