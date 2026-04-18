import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      if (!form.email || !form.password) {
        alert("Please fill in all fields");
        return;
      }

      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/");
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Login failed";
      console.error("Login error:", {
        status: error.response?.status,
        message: errorMsg,
        fullError: error
      });
      alert(errorMsg);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1>Login</h1>

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          style={inputStyle}
        />

        <button
          onClick={handleLogin}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 15px 45px rgba(37, 99, 235, 0.4), 0 0 20px rgba(37, 99, 235, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(37, 99, 235, 0.3), 0 0 15px rgba(37, 99, 235, 0.2)";
          }}
        >
          Login
        </button>

        <p>
          Don’t have account?{" "}
          <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

const pageStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0b1120",
  overflow: "hidden",
};

const cardStyle = {
  width: "380px",
  padding: "30px",
  borderRadius: "20px",
  background: "#1e293b",
  color: "white",
  boxShadow: "0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(59,130,246,0.15)",
  border: "1px solid rgba(59,130,246,0.2)",
  backdropFilter: "blur(12px)",
  position: "relative",
  transform: "translateZ(20px)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "12px",
  borderRadius: "10px",
  background: "#0f172a",
  color: "white",
  border: "1px solid #3b82f6",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "20px",
  borderRadius: "10px",
  background: "#2563eb",
  color: "white",
  border: "1px solid rgba(37, 99, 235, 0.5)",
  boxShadow: "0 10px 30px rgba(37, 99, 235, 0.3), 0 0 15px rgba(37, 99, 235, 0.2)",
  transition: "all 0.3s ease",
  cursor: "pointer",
};