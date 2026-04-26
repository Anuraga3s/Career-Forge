import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BrandCard from "../components/BrandCard";
import GoogleAuthButton from "../components/GoogleAuthButton";
import api from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSignup = async () => {
    try {
      await api.post("/auth/register", form);

      alert("Signup successful");
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Signup failed"
      );
    }
  };

  const handleGoogleSuccess = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/");
  };

  return (
    <div style={pageStyle}>
      <div style={authShellStyle}>
        <BrandCard maxWidth="380px" />
        <div style={cardStyle}>
          <h1>Signup</h1>

          <input
            placeholder="Full Name"
            style={inputStyle}
            onChange={(e) =>
              setForm({
                ...form,
                fullName: e.target.value,
              })
            }
          />

          <input
            placeholder="Email"
            style={inputStyle}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <button
            onClick={handleSignup}
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
            Signup
          </button>

          <div style={dividerStyle}>
            <span style={dividerLineStyle} />
            <span style={dividerTextStyle}>or</span>
            <span style={dividerLineStyle} />
          </div>

          <GoogleAuthButton
            label="Sign up with Google"
            onSuccess={handleGoogleSuccess}
          />

          <p>
            Already have account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0b1120",
  overflow: "hidden",
  padding: "24px",
  boxSizing: "border-box",
};

const authShellStyle = {
  width: "100%",
  maxWidth: "380px",
  display: "grid",
  gap: "18px",
};

const cardStyle = {
  width: "100%",
  padding: "30px",
  borderRadius: "20px",
  background: "#1e293b",
  color: "white",
  boxShadow: "0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(59,130,246,0.15)",
  border: "1px solid rgba(59,130,246,0.2)",
  backdropFilter: "blur(12px)",
  position: "relative",
  transform: "translateZ(20px)",
  boxSizing: "border-box",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  background: "#0f172a",
  color: "white",
  border: "1px solid #3b82f6",
  boxSizing: "border-box",
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

const dividerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "18px",
};

const dividerLineStyle = {
  flex: 1,
  height: "1px",
  background: "rgba(148, 163, 184, 0.25)",
};

const dividerTextStyle = {
  color: "#94a3b8",
  fontSize: "13px",
  textTransform: "uppercase",
  letterSpacing: "0.16em",
};
