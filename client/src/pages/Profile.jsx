import { useState, useEffect } from "react";
import api from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    college: "",
    branch: "",
    graduationYear: "",
    targetRole: "",
    skills: "",
    experienceLevel: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(profile);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profileData = {
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        college: res.data.college || "",
        branch: res.data.branch || "",
        graduationYear: res.data.graduationYear || "",
        targetRole: res.data.targetRole || "",
        skills: res.data.skills?.join(", ") || "",
        experienceLevel: res.data.experienceLevel || "",
      };

      setProfile(profileData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await api.put(
        "/auth/profile",
        {
          ...editProfile,
          skills: editProfile.skills.split(",").map((s) => s.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProfile(editProfile);
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };


  const infoItemStyle = {
    padding: "16px",
    borderRadius: "12px",
    background: "rgba(30,41,59,0.6)",
    border: "1px solid rgba(59,130,246,0.15)",
    transition: "all 0.2s ease",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#64748b",
    marginBottom: "6px",
  };

  const valueStyle = {
    fontSize: "17px",
    fontWeight: "600",
    color: "#f1f5f9",
    margin: 0,
    wordBreak: "break-word",
    overflowWrap: "break-word",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    marginTop: "8px",
    borderRadius: "10px",
    background: "#0f172a",
    color: "white",
    border: "1px solid rgba(59,130,246,0.3)",
    boxSizing: "border-box",
    boxShadow: "0 4px 12px rgba(59,130,246,0.15), inset 0 1px 2px rgba(255,255,255,0.05)",
    transition: "all 0.3s ease",
    fontSize: "15px",
  };

  const buttonStyle = (secondary = false) => ({
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    border: "none",
    transition: "all 0.3s ease",
    background: secondary
      ? "rgba(30,41,59,0.8)"
      : "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: secondary ? "#cbd5e1" : "#ffffff",
    boxShadow: secondary
      ? "0 0 0 rgba(0,0,0,0)"
      : "0 10px 25px rgba(37,99,235,0.3)",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0b1120", color: "white", padding: "40px 20px", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <h1 style={{ margin: "0", fontSize: "32px", fontWeight: "800", letterSpacing: "-0.02em" }}>My Profile</h1>
          {!isEditing && (
            <button
              onClick={handleEdit}
              style={{
                ...buttonStyle(false),
                padding: "10px 18px",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 14px 32px rgba(37,99,235,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(37,99,235,0.3)";
              }}
            >
              ✏️ Edit Details
            </button>
          )}
        </div>

        {!isEditing ? (
          // VIEW MODE
          <div style={{
            background: "linear-gradient(135deg, rgba(30,41,59,0.5), rgba(15,23,42,0.6))",
            border: "1px solid rgba(59,130,246,0.12)",
            borderRadius: "18px",
            padding: "32px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3), 0 0 30px rgba(59,130,246,0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}>
            {/* Personal Info */}
            <div style={infoItemStyle} onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.9)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.6)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)";
            }}>
              <div style={labelStyle}>Full Name</div>
              <p style={valueStyle}>{profile.fullName || "Not provided"}</p>
            </div>

            <div style={infoItemStyle} onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.9)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.6)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)";
            }}>
              <div style={labelStyle}>Email</div>
              <p style={valueStyle}>{profile.email || "Not provided"}</p>
            </div>

            <div style={infoItemStyle} onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.9)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.6)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)";
            }}>
              <div style={labelStyle}>College</div>
              <p style={valueStyle}>{profile.college || "Not provided"}</p>
            </div>

            <div style={infoItemStyle} onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.9)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.6)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)";
            }}>
              <div style={labelStyle}>Branch</div>
              <p style={valueStyle}>{profile.branch || "Not provided"}</p>
            </div>

            <div style={infoItemStyle} onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.9)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.6)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)";
            }}>
              <div style={labelStyle}>Graduation Year</div>
              <p style={valueStyle}>{profile.graduationYear || "Not provided"}</p>
            </div>

            <div style={infoItemStyle} onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.9)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.6)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)";
            }}>
              <div style={labelStyle}>Target Role</div>
              <p style={valueStyle}>{profile.targetRole || "Not provided"}</p>
            </div>

            <div style={{ ...infoItemStyle, gridColumn: "1 / -1" }} onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.9)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.6)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)";
            }}>
              <div style={labelStyle}>Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.split(",").map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: "linear-gradient(135deg, rgba(59,130,246,0.8), rgba(37,99,235,0.7))",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        border: "1px solid rgba(147,197,253,0.2)",
                      }}
                    >
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <p style={{ ...valueStyle, color: "#94a3b8" }}>Not provided</p>
                )}
              </div>
            </div>

            <div style={{ ...infoItemStyle, gridColumn: "1 / -1" }} onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.9)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(30,41,59,0.6)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)";
            }}>
              <div style={labelStyle}>Experience Level</div>
              <p style={valueStyle}>{profile.experienceLevel || "Not provided"}</p>
            </div>
          </div>
        ) : (
          // EDIT MODE
          <div style={{
            background: "linear-gradient(135deg, rgba(30,41,59,0.5), rgba(15,23,42,0.6))",
            border: "1px solid rgba(59,130,246,0.12)",
            borderRadius: "18px",
            padding: "32px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3), 0 0 30px rgba(59,130,246,0.08)",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
              {[
                { label: "Full Name", key: "fullName" },
                { label: "Email", key: "email" },
                { label: "College", key: "college" },
                { label: "Branch", key: "branch" },
                { label: "Graduation Year", key: "graduationYear" },
                { label: "Target Role", key: "targetRole" },
              ].map((field) => (
                <div key={field.key}>
                  <label style={labelStyle}>{field.label}</label>
                  <input
                    type="text"
                    value={editProfile[field.key]}
                    onChange={(e) =>
                      setEditProfile({
                        ...editProfile,
                        [field.key]: e.target.value,
                      })
                    }
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#60a5fa";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(59,130,246,0.3), inset 0 1px 2px rgba(255,255,255,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,130,246,0.15), inset 0 1px 2px rgba(255,255,255,0.05)";
                    }}
                  />
                </div>
              ))}

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Skills (comma-separated)</label>
                <input
                  type="text"
                  value={editProfile.skills}
                  onChange={(e) =>
                    setEditProfile({
                      ...editProfile,
                      skills: e.target.value,
                    })
                  }
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#60a5fa";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(59,130,246,0.3), inset 0 1px 2px rgba(255,255,255,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,130,246,0.15), inset 0 1px 2px rgba(255,255,255,0.05)";
                  }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Experience Level</label>
                <input
                  type="text"
                  value={editProfile.experienceLevel}
                  onChange={(e) =>
                    setEditProfile({
                      ...editProfile,
                      experienceLevel: e.target.value,
                    })
                  }
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#60a5fa";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(59,130,246,0.3), inset 0 1px 2px rgba(255,255,255,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,130,246,0.15), inset 0 1px 2px rgba(255,255,255,0.05)";
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={handleCancel}
                disabled={loading}
                style={{
                  ...buttonStyle(true),
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "rgba(30,41,59,1)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(30,41,59,0.8)";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                style={{
                  ...buttonStyle(false),
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 14px 32px rgba(37,99,235,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(37,99,235,0.3)";
                }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
