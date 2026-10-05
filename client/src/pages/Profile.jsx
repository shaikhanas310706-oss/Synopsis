import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Award,
  Flame,
  Clock,
  LogOut,
  Edit2,
  Check,
  RotateCcw,
  Menu
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { storageService } from "../services/storage";
import { adaptiveLearningService } from "../services/adaptiveLearning";

export default function Profile() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(storageService.getUser());
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [name, setName] = useState(user.name);
  const [educationLevel, setEducationLevel] = useState(user.educationLevel);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const analysis = adaptiveLearningService.analyzeStudentPerformance();

  const handleSave = (e) => {
    e.preventDefault();
    const updated = storageService.updateUser({ name, educationLevel });
    setUser(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    storageService.logout();
    navigate("/login");
  };

  const handleResetDemo = () => {
    if (window.confirm("Reset demo data back to default (Anas Shaikh with Computer Networks 45%)?")) {
      storageService.resetDemoData();
      setUser(storageService.getUser());
      alert("Demo data successfully reset!");
      window.location.reload();
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button className="btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={18} />
            </button>
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Student Profile</h1>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                Manage student credentials and college academic preferences
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {savedSuccess && (
              <div style={{ background: "var(--color-strong-light)", border: "1px solid var(--color-strong-border)", color: "var(--color-strong)", padding: "1rem", borderRadius: "var(--radius-md)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Check size={18} /> Profile details successfully updated!
              </div>
            )}

            {/* Profile Overview Card */}
            <div className="card" style={{ padding: "2.5rem 2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem" }}>
                <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--primary), #3b82f6)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1.75rem",
                      boxShadow: "var(--shadow-md)"
                    }}
                  >
                    {user.name.charAt(0)}
                  </div>

                  <div>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{user.name}</h2>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
                      <Mail size={15} /> {user.email}
                    </div>
                    <div style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <GraduationCap size={15} /> {user.educationLevel}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit2 size={14} /> {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                  <button className="btn btn-secondary btn-sm" style={{ color: "#ef4444", borderColor: "#fecaca" }} onClick={handleLogout}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>

              {/* Edit Profile Form */}
              {isEditing && (
                <form onSubmit={handleSave} style={{ background: "var(--bg-surface)", padding: "1.5rem", borderRadius: "var(--radius-md)", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>Edit Academic Information</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="chat-input-field"
                        style={{ width: "100%", background: "white" }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                        Education Level
                      </label>
                      <input
                        type="text"
                        className="chat-input-field"
                        style={{ width: "100%", background: "white" }}
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Learning Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem" }}>
                <div style={{ padding: "1rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>CURRENT STREAK</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-average)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Flame size={18} /> {user.streakDays} Days
                  </div>
                </div>

                <div style={{ padding: "1rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>LEARNING HOURS</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Clock size={18} /> {user.learningHours} hrs
                  </div>
                </div>

                <div style={{ padding: "1rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>LESSONS COMPLETED</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-strong)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Check size={18} /> {user.completedLessonsCount}
                  </div>
                </div>

                <div style={{ padding: "1rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>OVERALL ACCURACY</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    {analysis.overallAverage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Enrolled Subjects & Reset Demo Card */}
            <div className="card">
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Enrolled Subjects & Target Domains</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {user.subjects?.map((sub) => (
                  <span key={sub} className="badge badge-primary" style={{ padding: "0.45rem 0.85rem", fontSize: "0.82rem" }}>
                    <BookOpen size={13} /> {sub}
                  </span>
                ))}
              </div>

              <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Reset Demo Environment</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Restores initial student scores: Python (82%), DBMS (68%), Computer Networks (45%).
                  </div>
                </div>

                <button className="btn btn-secondary btn-sm" onClick={handleResetDemo}>
                  <RotateCcw size={14} /> Reset Demo Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
