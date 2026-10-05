import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Target,
  BookOpen,
  Menu,
  RotateCcw
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { ProgressBar } from "../components/DashboardCard";
import { adaptiveLearningService } from "../services/adaptiveLearning";
import { storageService } from "../services/storage";

export default function Recommendations() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const analysis = adaptiveLearningService.analyzeStudentPerformance();

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
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800 }}>AI Learning Assistant</h1>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                Diagnostic Analysis & Personalized Step-by-Step Learning Path
              </p>
            </div>
          </div>

          <div className="badge badge-primary">
            <Sparkles size={14} /> Rule-Based Engine
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          {/* Top Recommendation Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)",
              borderRadius: "var(--radius-xl)",
              padding: "2rem",
              color: "white",
              marginBottom: "2rem",
              boxShadow: "var(--shadow-md)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span className="badge" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                <Sparkles size={13} /> Active Recommendation
              </span>
              {analysis.primaryRecommendation?.severity === "weak" && (
                <span className="badge badge-weak">High Priority Action</span>
              )}
            </div>

            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "white", marginBottom: "0.5rem" }}>
              {analysis.primaryRecommendation?.title}
            </h2>
            <p style={{ color: "#c7d2fe", fontSize: "1rem", maxWidth: "800px", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              {analysis.primaryRecommendation?.message}
            </p>

            <Link
              to={analysis.primaryRecommendation?.courseId ? `/courses/${analysis.primaryRecommendation.courseId}` : "/courses"}
              className="btn btn-primary"
              style={{ background: "#ffffff", color: "#1e1b4b" }}
            >
              Start Recommended Action Now <ArrowRight size={16} />
            </Link>
          </div>

          {/* Section 1: Your Learning Analysis */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.35rem", marginBottom: "0.25rem" }}>Your Learning Analysis</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Classification based on your stored quiz performances and diagnostic tests.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {/* Strong Subjects */}
              <div style={{ border: "1px solid var(--color-strong-border)", background: "var(--color-strong-light)", borderRadius: "var(--radius-md)", padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "var(--color-strong)", marginBottom: "0.75rem" }}>
                  <Award size={18} /> Strong Competencies (Score ≥ 80%)
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {analysis.strongSubjects.map((s) => (
                    <div key={s.subject} style={{ background: "white", padding: "0.85rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{s.subject}</span>
                        <span className="badge badge-strong">{s.score}%</span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                        {s.actionAdvice}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Average Subjects */}
              <div style={{ border: "1px solid var(--color-average-border)", background: "var(--color-average-light)", borderRadius: "var(--radius-md)", padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "var(--color-average)", marginBottom: "0.75rem" }}>
                  <Sparkles size={18} /> Average Areas (50% - 79%)
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {analysis.averageSubjects.map((s) => (
                    <div key={s.subject} style={{ background: "white", padding: "0.85rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{s.subject}</span>
                        <span className="badge badge-average">{s.score}%</span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                        {s.actionAdvice}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weak Subjects */}
              <div style={{ border: "1px solid var(--color-weak-border)", background: "var(--color-weak-light)", borderRadius: "var(--radius-md)", padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "var(--color-weak)", marginBottom: "0.75rem" }}>
                  <AlertTriangle size={18} /> Weak Areas (Score &lt; 50%)
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {analysis.weakSubjects.map((s) => (
                    <div key={s.subject} style={{ background: "white", padding: "0.85rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{s.subject}</span>
                        <span className="badge badge-weak">{s.score}%</span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                        {s.actionAdvice}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Recommended Step-by-Step Learning Path */}
          <div className="card">
            <div style={{ marginBottom: "1.5rem" }}>
              <div className="badge badge-primary" style={{ marginBottom: "0.4rem" }}>
                Adaptive Curriculum
              </div>
              <h2 style={{ fontSize: "1.35rem" }}>Recommended Step-by-Step Learning Path</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Follow this sequential path to lift weak topics into the Strong threshold.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {analysis.learningPath.map((step, idx) => {
                const isInProgress = step.status === "in_progress";
                const isNext = step.status === "next";

                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1.25rem",
                      padding: "1.25rem",
                      borderRadius: "var(--radius-lg)",
                      border: isInProgress ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                      background: isInProgress ? "var(--primary-light)" : "white",
                      boxShadow: isInProgress ? "var(--shadow-sm)" : "none"
                    }}
                  >
                    {/* Step Number Bubble */}
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: isInProgress ? "var(--primary)" : isNext ? "var(--bg-surface)" : "var(--bg-surface)",
                        color: isInProgress ? "white" : "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "1rem",
                        flexShrink: 0
                      }}
                    >
                      {step.stepNumber}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{step.title}</h4>
                        <span className="badge badge-gray" style={{ fontSize: "0.72rem" }}>
                          {step.badgeText}
                        </span>
                        {isInProgress && (
                          <span className="badge badge-primary" style={{ fontSize: "0.72rem" }}>
                            Current Focus
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                        {step.description}
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Clock size={13} /> {step.estimatedMinutes} mins
                      </span>

                      {isInProgress ? (
                        <Link to="/courses/cn-101" className="btn btn-primary btn-sm">
                          Start Step <ArrowRight size={14} />
                        </Link>
                      ) : isNext ? (
                        <Link to="/courses/cn-101" className="btn btn-secondary btn-sm">
                          Preview
                        </Link>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Locked</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
