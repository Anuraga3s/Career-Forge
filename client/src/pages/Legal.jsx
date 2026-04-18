export default function Legal() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        color: "#cbd5f5",
        lineHeight: "1.7",
      }}
    >
      <h1 style={{ color: "#fff", marginBottom: "20px" }}>
        Privacy & Terms
      </h1>

      <p>
        At <strong>CareerForge AI</strong>, we value your privacy and are committed
        to protecting your data.
      </p>

      <h3 style={{ marginTop: "20px", color: "#93c5fd" }}>
        🔒 Data Security
      </h3>
      <p>
        Your uploaded resumes and job descriptions are processed securely.
        We do not share your personal data with third parties.
      </p>

      <h3 style={{ marginTop: "20px", color: "#93c5fd" }}>
        📊 Data Usage
      </h3>
      <p>
        Your data is only used to provide analysis, comparison, and
        personalized recommendations within the platform.
      </p>

      <h3 style={{ marginTop: "20px", color: "#93c5fd" }}>
        🤝 User Responsibility
      </h3>
      <p>
        Users are responsible for the accuracy of the data they upload.
      </p>

      <h3 style={{ marginTop: "20px", color: "#93c5fd" }}>
        📬 Contact
      </h3>
      <p>
        For any concerns, contact us at: <strong>a3scoltd@gmail.com</strong>
      </p>

      <p style={{ marginTop: "30px", fontSize: "13px", color: "#64748b" }}>
        Last updated: {new Date().getFullYear()}
      </p>
    </div>
  );
}