import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import BrandCard from "./BrandCard";
import Footer from "./Footer";
export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1500);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { name: "Profile", path: "/profile", icon: "👤" },
    { name: "Dashboard", path: "/", icon: "🏠" },
    { name: "Resume", path: "/resume", icon: "📄" },
    { name: "JD Compare", path: "/jd-compare", icon: "📊" },
    { name: "Mock Interview", path: "/mock-interview", icon: "🎤" },
    { name: "Quiz History", path: "/quiz-history", icon: "📝" },
  ];

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1500;
      setIsMobile(mobile);
      if (!mobile) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinkStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "10px" : "10px",
    padding: isMobile ? "14px 16px" : "11px 16px",
    borderRadius: "16px",
    textDecoration: "none",
    fontWeight: "700",
    whiteSpace: "nowrap",
    fontSize: isMobile ? "16px" : "15px",
    transition: "all 0.22s ease",
    background: isActive
      ? "linear-gradient(135deg, rgba(59,130,246,0.96), rgba(37,99,235,0.88))"
      : "rgba(15, 23, 42, 0.72)",
    color: isActive ? "#ffffff" : "#dbe7ff",
    border: isActive
      ? "1px solid rgba(147,197,253,0.24)"
      : "1px solid rgba(148,163,184,0.14)",
    boxShadow: isActive
      ? "0 16px 28px rgba(59,130,246,0.22)"
      : "0 0 0 rgba(0,0,0,0)",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #18243a 0%, #0b1120 38%, #09101d 100%)",
        color: "white",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          background:
            "linear-gradient(180deg, rgba(10,15,30,0.96) 0%, rgba(13,19,36,0.92) 100%)",
          borderBottom: "1px solid rgba(96,165,250,0.14)",
          boxShadow: "0 12px 30px rgba(2, 6, 23, 0.26)",
        }}
      >
        <div
          style={{
            maxWidth: "1600px",
            margin: "0 auto",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "14px" : "12px",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <BrandCard
            compact
            maxWidth={isMobile ? "calc(100% - 64px)" : "320px"}
          />

          {isMobile ? (
            <button
              onClick={() => setMenuOpen((open) => !open)}
              style={{
                padding: "10px 12px",
                borderRadius: "12px",
                border: "1px solid rgba(96,165,250,0.22)",
                background: "rgba(15,23,42,0.92)",
                color: "#e5eefc",
                cursor: "pointer",
                flexShrink: 0,
                minWidth: "46px",
              }}
            >
              ☰
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "nowrap",
                justifyContent: "flex-start",
                minWidth: 0,
                overflow: "auto",
                whiteSpace: "nowrap",
                flex: 1,
                marginLeft: "18px",
                paddingLeft: "0",
                paddingRight: "0",
                boxSizing: "border-box",
              }}
            >
              {menuItems.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={navLinkStyle(isActive)}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 10px 20px rgba(2, 6, 23, 0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = isActive
                        ? "0 12px 22px rgba(37,99,235,0.24)"
                        : "inset 0 1px 0 rgba(255,255,255,0.02)";
                    }}
                  >
                    <span
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "10px",
                        display: "grid",
                        placeItems: "center",
                        background: isActive
                          ? "rgba(255,255,255,0.16)"
                          : "rgba(59,130,246,0.10)",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <div
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                style={{
                  ...navLinkStyle(false),
                  color: "#fda4af",
                  background:
                    "linear-gradient(135deg, rgba(127,29,29,0.30), rgba(69,10,10,0.20))",
                  border: "1px solid rgba(248,113,113,0.18)",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "10px",
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(255,255,255,0.08)",
                  }}
                >
                  🚪
                </span>
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>

        {isMobile && menuOpen && (
          <div
            style={{
              padding: "10px 16px 16px 16px",
              background:
                "linear-gradient(180deg, rgba(10,15,30,0.98) 0%, rgba(13,19,36,0.95) 100%)",
              borderTop: "1px solid rgba(148,163,184,0.08)",
              boxShadow: "0 20px 40px rgba(2, 6, 23, 0.32)",
              maxHeight: "calc(100vh - 140px)",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                borderRadius: "22px",
                padding: "14px",
                background:
                  "linear-gradient(180deg, rgba(15,23,42,0.94), rgba(15,23,42,0.82))",
                border: "1px solid rgba(96,165,250,0.14)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                display: "grid",
                gap: "10px",
                gridAutoRows: "max-content",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "2px 4px 10px 4px",
                  borderBottom: "1px solid rgba(148,163,184,0.08)",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      color: "#93c5fd",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    Navigation
                  </p>
                  <h3
                    style={{
                      margin: "4px 0 0 0",
                      fontSize: "18px",
                      color: "#f8fafc",
                    }}
                  >
                    Quick Access
                  </h3>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "12px",
                    border: "1px solid rgba(148,163,184,0.14)",
                    background: "rgba(30,41,59,0.72)",
                    color: "#dbe7ff",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              {menuItems.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      ...navLinkStyle(isActive),
                      width: "100%",
                      justifyContent: "space-between",
                      borderRadius: "18px",
                      padding: "14px 16px",
                      background: isActive
                        ? "linear-gradient(135deg, rgba(37,99,235,0.96), rgba(59,130,246,0.86))"
                        : "rgba(17,24,39,0.92)",
                      boxShadow: isActive
                        ? "0 14px 30px rgba(37,99,235,0.24), inset 0 1px 0 rgba(255,255,255,0.12)"
                        : "inset 0 1px 0 rgba(255,255,255,0.03)",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "12px",
                          display: "grid",
                          placeItems: "center",
                          background: isActive
                            ? "rgba(255,255,255,0.16)"
                            : "rgba(59,130,246,0.12)",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </span>
                    <span style={{ color: isActive ? "#dbeafe" : "#64748b" }}>
                      ›
                    </span>
                  </Link>
                );
              })}

              <div
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                style={{
                  ...navLinkStyle(false),
                  width: "100%",
                  justifyContent: "space-between",
                  borderRadius: "18px",
                  padding: "14px 16px",
                  color: "#fda4af",
                  background:
                    "linear-gradient(135deg, rgba(127,29,29,0.34), rgba(69,10,10,0.22))",
                  border: "1px solid rgba(248,113,113,0.18)",
                  boxShadow: "0 12px 24px rgba(69,10,10,0.12)",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "12px",
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(255,255,255,0.08)",
                    }}
                  >
                    🚪
                  </span>
                  <span>Logout</span>
                </span>
                <span style={{ color: "#fda4af" }}>›</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          paddingTop: isMobile ? "86px" : "96px",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
