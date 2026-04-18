import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        borderTop: "1px solid rgba(148,163,184,0.12)",
        background: "rgba(9,16,29,0.9)",
        backdropFilter: "blur(10px)",
        padding: "12px 20px",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          fontSize: "13px",
          color: "#94a3b8",
        }}
      >
        {/* LEFT */}
        <span>© {new Date().getFullYear()} CareerForge AI</span>

        {/* RIGHT */}
        <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
          {/* MAIL LINK */}
          <a
            href="mailto:a3scoltd@gmail.com"
            style={{
              textDecoration: "none",
              color: "#60a5fa",
              fontWeight: "500",
            }}
          >
            📧 Contact
          </a>

          <Link
            to="/legal"
            style={{ color: "#94a3b8", textDecoration: "none" }}
          >
            Privacy & Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
