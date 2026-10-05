import React from "react";
import { Brain, Heart, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0f172a", color: "#94a3b8", padding: "3rem 2rem 2rem", borderTop: "1px solid #1e293b" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2.5rem", marginBottom: "2.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "white", fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.75rem" }}>
            <div className="brand-icon" style={{ width: "30px", height: "30px" }}>
              <Brain size={16} />
            </div>
            <span>AI Adaptive Learning Platform</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.6 }}>
            An intelligent college mini project engineered to personalize learning trajectories through rule-based adaptive classification and diagnostic analytics.
          </p>
        </div>

        <div>
          <h4 style={{ color: "white", fontSize: "0.9rem", fontWeight: 700, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Platform Modules
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
            <li><Link to="/dashboard" style={{ color: "#94a3b8" }}>Student Dashboard</Link></li>
            <li><Link to="/courses" style={{ color: "#94a3b8" }}>Course Catalog</Link></li>
            <li><Link to="/quizzes" style={{ color: "#94a3b8" }}>Adaptive Quizzes</Link></li>
            <li><Link to="/recommendations" style={{ color: "#94a3b8" }}>AI Recommendations</Link></li>
            <li><Link to="/study-assistant" style={{ color: "#94a3b8" }}>AI Study Assistant</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: "white", fontSize: "0.9rem", fontWeight: 700, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Adaptive Metrics
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
            <li><span style={{ color: "#34d399" }}>● Strong (Score ≥ 80%)</span></li>
            <li><span style={{ color: "#fbbf24" }}>● Average (Score 50% - 79%)</span></li>
            <li><span style={{ color: "#f87171" }}>● Weak (Score &lt; 50%)</span></li>
            <li><span>Real-time LocalStorage Sync</span></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: "white", fontSize: "0.9rem", fontWeight: 700, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Project Metadata
          </h4>
          <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "white" }}>
              <GraduationCap size={16} color="var(--primary)" /> College Mini Project 2026
            </div>
            <div>Department of Computer Science & Engineering</div>
            <div>Student: Anas Shaikh</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", paddingTop: "1.5rem", borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.8rem" }}>
        <div>
          © 2026 AI Adaptive Learning Platform. Built with React, Vite, Recharts, and LocalStorage.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          Designed for personalized student success
        </div>
      </div>
    </footer>
  );
}
