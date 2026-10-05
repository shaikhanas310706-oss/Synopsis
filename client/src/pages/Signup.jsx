import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, User, Mail, Lock, GraduationCap, ArrowRight, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { storageService } from "../services/storage";

const AVAILABLE_SUBJECTS = [
  "Python",
  "DBMS",
  "Computer Networks",
  "Cloud Computing",
  "Artificial Intelligence",
  "Data Structures",
  "JavaScript"
];

export default function Signup({ onSignupSuccess }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [educationLevel, setEducationLevel] = useState("B.Tech Computer Science (3rd Year)");
  const [selectedSubjects, setSelectedSubjects] = useState(["Python", "DBMS", "Computer Networks"]);
  const [error, setError] = useState("");

  const handleToggleSubject = (sub) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    storageService.signup({
      fullName,
      email,
      educationLevel,
      subjects: selectedSubjects
    });

    if (onSignupSuccess) onSignupSuccess();
    navigate("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)" }}>
      <Navbar isLoggedIn={false} />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
        <div className="card" style={{ maxWidth: "520px", width: "100%", padding: "2.5rem 2rem", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="brand-icon" style={{ width: "48px", height: "48px", margin: "0 auto 1rem" }}>
              <Brain size={26} />
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.35rem" }}>
              Create Student Account
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
              Join the AI Adaptive Learning Platform
            </p>
          </div>

          {error && (
            <div style={{ background: "var(--color-weak-light)", border: "1px solid var(--color-weak-border)", color: "var(--color-weak)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  className="chat-input-field"
                  style={{ paddingLeft: "2.25rem", width: "100%" }}
                  placeholder="e.g. Anas Shaikh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                College Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                <input
                  type="email"
                  className="chat-input-field"
                  style={{ paddingLeft: "2.25rem", width: "100%" }}
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Password
                </label>
                <input
                  type="password"
                  className="chat-input-field"
                  style={{ width: "100%" }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="chat-input-field"
                  style={{ width: "100%" }}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Education Level / Degree
              </label>
              <select
                className="chat-input-field"
                style={{ width: "100%", background: "white" }}
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
              >
                <option value="B.Tech Computer Science (3rd Year)">B.Tech Computer Science (3rd Year)</option>
                <option value="B.Tech Information Technology">B.Tech Information Technology</option>
                <option value="BCA / MCA Program">BCA / MCA Program</option>
                <option value="Diploma in Engineering">Diploma in Engineering</option>
                <option value="Postgraduate Master's">Postgraduate Master's</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                Select Subjects / Target Domains:
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {AVAILABLE_SUBJECTS.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => handleToggleSubject(sub)}
                      className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-secondary"}`}
                    >
                      {isSelected && <Check size={12} />} {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "0.5rem" }}>
              Complete Registration <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-light)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ fontWeight: 700, color: "var(--primary)" }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
