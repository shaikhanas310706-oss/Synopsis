import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Lock, Mail, ArrowRight, UserCheck, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { storageService, DEMO_STUDENT } from "../services/storage";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_STUDENT.email);
  const [password, setPassword] = useState("college123");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    storageService.login(email, password, rememberMe);
    if (onLoginSuccess) onLoginSuccess();
    navigate("/dashboard");
  };

  const handleDemoLogin = () => {
    storageService.login(DEMO_STUDENT.email, "college123", true);
    if (onLoginSuccess) onLoginSuccess();
    navigate("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)" }}>
      <Navbar isLoggedIn={false} />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
        <div className="card" style={{ maxWidth: "440px", width: "100%", padding: "2.5rem 2rem", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="brand-icon" style={{ width: "48px", height: "48px", margin: "0 auto 1rem" }}>
              <Brain size={26} />
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.35rem" }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
              Sign in to access your adaptive learning dashboard
            </p>
          </div>

          {/* One-Click Demo Student Login Card */}
          <div
            style={{
              background: "var(--primary-light)",
              border: "1px solid rgba(79, 70, 229, 0.2)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              marginBottom: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <Sparkles size={14} /> Quick Demo Student
              </span>
              <span className="badge badge-primary" style={{ fontSize: "0.7rem" }}>
                College Mini Project
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0 }}>
              Pre-filled with student profile: <strong>Anas Shaikh</strong> (Python, DBMS, Computer Networks 45%).
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ width: "100%", marginTop: "0.25rem" }}
              onClick={handleDemoLogin}
            >
              <UserCheck size={14} /> One-Click Demo Login
            </button>
          </div>

          {error && (
            <div style={{ background: "var(--color-weak-light)", border: "1px solid var(--color-weak-border)", color: "var(--color-weak)", padding: "0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.85rem", marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                College Email Address
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

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                <input
                  type="password"
                  className="chat-input-field"
                  style={{ paddingLeft: "2.25rem", width: "100%" }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: "var(--primary)" }}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Demo password is: college123"); }} style={{ color: "var(--primary)", fontWeight: 600 }}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.75rem" }}>
              Sign In to Dashboard <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-light)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ fontWeight: 700, color: "var(--primary)" }}>
              Sign up here
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
