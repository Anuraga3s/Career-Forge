import { useRef } from "react";
import { Link } from "react-router-dom";

export default function BrandCard({
  compact = false,
  maxWidth = "320px",
  linkTo = "/",
}) {
  const brandCardRef = useRef(null);

  const handleBrandCardMove = (event) => {
    const card = brandCardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const rotateY = (offsetX / rect.width - 0.5) * 30;
    const rotateX = (0.5 - offsetY / rect.height) * 24;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.035)`;
    card.style.boxShadow =
      "0 32px 58px rgba(15, 23, 42, 0.52), 0 0 32px rgba(59,130,246,0.22), 0 0 24px rgba(239,68,68,0.18)";
    card.style.borderColor = "rgba(96, 165, 250, 0.40)";
  };

  const resetBrandCardTilt = () => {
    const card = brandCardRef.current;
    if (!card) return;

    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    card.style.boxShadow =
      "0 14px 28px rgba(15, 23, 42, 0.26), inset 0 1px 0 rgba(255,255,255,0.08)";
    card.style.borderColor = "rgba(248, 113, 113, 0.18)";
  };

  return (
    <Link
      to={linkTo}
      style={{
        textDecoration: "none",
        display: "block",
        width: "100%",
        maxWidth,
      }}
    >
      <div
        ref={brandCardRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minWidth: 0,
          padding: compact ? "10px 14px" : "14px 18px",
          borderRadius: "18px",
          background:
            "radial-gradient(circle at top left, rgba(248,113,113,0.26), transparent 34%), radial-gradient(circle at bottom right, rgba(96,165,250,0.20), transparent 36%), linear-gradient(155deg, rgba(10,15,30,0.98), rgba(20,31,55,0.98) 58%, rgba(16,24,40,0.98))",
          border: "1px solid rgba(248, 113, 113, 0.18)",
          boxShadow:
            "0 14px 28px rgba(15, 23, 42, 0.26), inset 0 1px 0 rgba(255,255,255,0.08)",
          transition:
            "transform 0.14s ease, box-shadow 0.18s ease, border-color 0.18s ease",
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
        }}
        onMouseMove={handleBrandCardMove}
        onMouseLeave={resetBrandCardTilt}
      >
        <div
          style={{
            width: compact ? "42px" : "48px",
            height: compact ? "42px" : "48px",
            borderRadius: compact ? "14px" : "16px",
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(145deg, #ef4444, #3b82f6)",
            boxShadow:
              "0 12px 24px rgba(37,99,235,0.22), 0 0 12px rgba(239,68,68,0.12), inset 0 1px 0 rgba(255,255,255,0.22)",
            fontSize: compact ? "22px" : "26px",
            flexShrink: 0,
          }}
        >
          🕸
        </div>

        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: compact ? "11px" : "12px",
              fontWeight: "700",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#f8b4b4",
            }}
          >
            AI Placement Coach
          </p>

          <h2
            style={{
              margin: "2px 0 0 0",
              fontSize: compact ? "20px" : "24px",
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            CareerForge
          </h2>
        </div>
      </div>
    </Link>
  );
}
