import React, { useState, useEffect } from "react";
import {
  Users,
  AlertTriangle,
  TrendingDown,
  PlusCircle,
  CheckCircle2,
  Sliders,
  Layers,
  Sparkles,
  BookOpen
} from "lucide-react";
import { api } from "../services/api";
import { playClickTick, playSuccessChime } from "../utils/audio";

export default function EducatorStudio({ courses }) {
  const [cohortData, setCohortData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthoringModal, setShowAuthoringModal] = useState(false);

  // Authoring Form State
  const [conceptId, setConceptId] = useState("backprop");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState(0.5);
  const [bloomLevel, setBloomLevel] = useState("Application");
  const [questionText, setQuestionText] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: true, explanation: "Correct mathematical application.", misconceptionType: "" },
    { text: "", isCorrect: false, explanation: "Common misunderstanding.", misconceptionType: "Linear Assumption" },
    { text: "", isCorrect: false, explanation: "Calculation or sign error.", misconceptionType: "Sign Flip" },
    { text: "", isCorrect: false, explanation: "Confusing operation order.", misconceptionType: "Precedence Error" }
  ]);
  const [hint, setHint] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadCohort();
  }, []);

  const loadCohort = async () => {
    try {
      const res = await api.getEducatorCohort();
      setCohortData(res.cohort);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (idx, field, val) => {
    const updated = [...options];
    updated[idx][field] = val;
    setOptions(updated);
  };

  const handleSetCorrectOption = (idx) => {
    playClickTick();
    const updated = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === idx
    }));
    setOptions(updated);
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    playClickTick();

    if (!title || !questionText || options.some((o) => !o.text.trim())) {
      alert("Please fill in the title, question text, and all 4 options.");
      return;
    }

    try {
      await api.createQuestion({
        conceptId,
        difficulty: parseFloat(difficulty),
        bloomLevel,
        title,
        questionText,
        codeSnippet: codeSnippet.trim() || null,
        options,
        hints: hint.trim() ? [hint] : ["Examine the foundational assumptions."]
      });

      playSuccessChime();
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowAuthoringModal(false);
        // Reset form
        setTitle("");
        setQuestionText("");
        setCodeSnippet("");
        setHint("");
      }, 1200);
    } catch (err) {
      console.error(err);
      alert("Failed to create question. Check server logs.");
    }
  };

  if (loading || !cohortData) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>
        ⚡ Gathering class cohort telemetry...
      </div>
    );
  }

  const allNodes = courses ? courses.flatMap((c) => c.nodes) : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Top Banner & Quick Metrics */}
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Users size={24} color="var(--accent-indigo)" /> Educator Analytics Studio
          </h1>
          <div className="section-subtitle">
            Cohort: {cohortData.cohortName} — Real-time predictive telemetry & curriculum authoring
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            playClickTick();
            setShowAuthoringModal(true);
          }}
        >
          <PlusCircle size={16} /> Author Adaptive Item
        </button>
      </div>

      {/* Metric Cards */}
      <div className="analytics-grid">
        <div className="metric-card col-span-3">
          <div className="metric-label">Class Average Mastery</div>
          <div className="metric-val" style={{ color: "var(--accent-emerald)" }}>
            {cohortData.classAverageMastery}%
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Bayesian cross-concept mean
          </p>
        </div>

        <div className="metric-card col-span-3">
          <div className="metric-label">Active Learners Today</div>
          <div className="metric-val" style={{ color: "#38bdf8" }}>
            {cohortData.activeToday} / {cohortData.totalStudents}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            75% daily cohort engagement
          </p>
        </div>

        <div className="metric-card col-span-3">
          <div className="metric-label">At-Risk Early Warnings</div>
          <div className="metric-val" style={{ color: "var(--accent-rose)" }}>
            {cohortData.atRiskStudentsCount}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Learners triggering drop-off signals
          </p>
        </div>

        <div className="metric-card col-span-3">
          <div className="metric-label">Calibrated Items Active</div>
          <div className="metric-val" style={{ color: "#fbbf24" }}>
            48 Items
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Across 4 Bloom & IRT tiers
          </p>
        </div>
      </div>

      {/* Concept Bottleneck Heatmap */}
      <div className="glass-panel">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <TrendingDown size={20} color="var(--accent-rose)" /> Concept Bottleneck Analysis
            </h2>
            <div className="section-subtitle">
              Nodes with highest student error rates and top diagnosed misconceptions
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {cohortData.conceptBottlenecks?.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem",
                borderTop: "3px solid var(--accent-rose)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{item.conceptTitle}</span>
                <span style={{ fontWeight: 800, color: "var(--accent-rose)", fontSize: "0.9rem" }}>
                  {item.failureRate}% Fail
                </span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                <strong style={{ color: "#fda4af" }}>Root Misconception:</strong> {item.commonMisconception}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Learner Telemetry Table */}
      <div className="glass-panel">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <Users size={20} color="var(--accent-cyan)" /> Student Mastery & Predictive Risk Registry
            </h2>
            <div className="section-subtitle">
              Live Bayesian mastery updates and metacognition calibration
            </div>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="educator-table">
            <thead>
              <tr>
                <th>Learner Name</th>
                <th>Domain Mastery</th>
                <th>Velocity</th>
                <th>Metacognition</th>
                <th>Last Active Concept</th>
                <th>Risk Status</th>
                <th>Diagnostic Flag</th>
              </tr>
            </thead>
            <tbody>
              {cohortData.students?.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div className="mastery-bar-track" style={{ width: "60px", height: "5px" }}>
                        <div
                          className="mastery-bar-fill"
                          style={{
                            width: `${s.mastery}%`,
                            background: s.mastery >= 75 ? "#10b981" : s.mastery >= 50 ? "#6366f1" : "#f43f5e"
                          }}
                        />
                      </div>
                      <span>{s.mastery}%</span>
                    </div>
                  </td>
                  <td>{s.velocity}x</td>
                  <td>{s.confidenceCalibration}%</td>
                  <td style={{ color: "var(--accent-cyan)" }}>{s.lastTopic}</td>
                  <td>
                    <span className={`risk-pill ${s.riskLevel}`}>{s.riskLevel}</span>
                  </td>
                  <td style={{ fontSize: "0.8rem", color: s.struggleConcept ? "#fb7185" : "var(--text-muted)" }}>
                    {s.struggleConcept ? `⚠️ ${s.struggleConcept}` : "On Track"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Authoring Modal */}
      {showAuthoringModal && (
        <div className="quiz-modal-overlay" onClick={() => setShowAuthoringModal(false)}>
          <div
            className="quiz-modal-card"
            style={{ maxWidth: "720px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="quiz-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <PlusCircle size={20} color="var(--accent-cyan)" />
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  Author New Calibrated Question
                </span>
              </div>
              <button className="btn-icon" onClick={() => setShowAuthoringModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>
                    Target Concept Node
                  </label>
                  <select
                    className="course-selector-select"
                    style={{ width: "100%" }}
                    value={conceptId}
                    onChange={(e) => setConceptId(e.target.value)}
                  >
                    {allNodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>
                    Bloom Taxonomy Level
                  </label>
                  <select
                    className="course-selector-select"
                    style={{ width: "100%" }}
                    value={bloomLevel}
                    onChange={(e) => setBloomLevel(e.target.value)}
                  >
                    <option value="Recall">Recall (Foundational)</option>
                    <option value="Application">Application (Practical)</option>
                    <option value="Analysis">Analysis (Deep Reasoning)</option>
                    <option value="Synthesis">Synthesis / Edge Cases</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span>IRT Item Difficulty Parameter (b):</span>
                  <span style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>{difficulty}</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.95"
                  step="0.05"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  style={{ width: "100%", accentColor: "var(--accent-cyan)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>
                  Question Title / Short Summary
                </label>
                <input
                  type="text"
                  className="tutor-input"
                  style={{ width: "100%" }}
                  placeholder="e.g. Identity Mapping Gradient Highways"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>
                  Detailed Question Statement
                </label>
                <textarea
                  className="tutor-input"
                  style={{ width: "100%", height: "80px", resize: "vertical" }}
                  placeholder="Explain the scenario and core dilemma..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>
                  Code Snippet (Optional)
                </label>
                <textarea
                  className="tutor-input"
                  style={{ width: "100%", height: "70px", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}
                  placeholder="# Optional code block..."
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                />
              </div>

              {/* 4 Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Options (Select radio button for the correct answer):
                </label>
                {options.map((opt, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      background: "var(--bg-surface)",
                      padding: "0.6rem",
                      borderRadius: "var(--radius-md)"
                    }}
                  >
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => handleSetCorrectOption(i)}
                      style={{ accentColor: "var(--accent-emerald)" }}
                    />
                    <input
                      type="text"
                      className="tutor-input"
                      style={{ flex: 2 }}
                      placeholder={`Option ${i + 1} text...`}
                      value={opt.text}
                      onChange={(e) => handleOptionChange(i, "text", e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="tutor-input"
                      style={{ flex: 1, fontSize: "0.78rem" }}
                      placeholder="Misconception tag (e.g. Sign Flip)"
                      value={opt.misconceptionType}
                      onChange={(e) => handleOptionChange(i, "misconceptionType", e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>
                  Socratic Clue / Progressive Hint
                </label>
                <input
                  type="text"
                  className="tutor-input"
                  style={{ width: "100%" }}
                  placeholder="Guiding prompt without giving away answer directly..."
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                />
              </div>

              {submitSuccess ? (
                <div style={{ color: "var(--accent-emerald)", textAlign: "center", fontWeight: 700, padding: "0.5rem" }}>
                  ✓ Question successfully calibrated and added to adaptive bank!
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowAuthoringModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Publish Adaptive Item
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
