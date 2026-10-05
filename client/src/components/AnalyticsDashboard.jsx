import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Brain,
  Award,
  Calendar,
  Layers,
  RotateCw,
  Sparkles,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { api } from "../services/api";
import { playClickTick, playSuccessChime } from "../utils/audio";

export default function AnalyticsDashboard({ onTriggerPracticeForConcept }) {
  const [data, setData] = useState(null);
  const [srsCards, setSrsCards] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [analyticsRes, srsRes] = await Promise.all([
        api.getStudentAnalytics(),
        api.getSrsCards()
      ]);
      setData(analyticsRes);
      setSrsCards(srsRes.cards || []);
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSrsReview = async (rating) => {
    if (srsCards.length === 0) return;
    const currentCard = srsCards[activeCardIndex];

    playClickTick();
    try {
      await api.reviewSrsCard(currentCard.id, rating);
      playSuccessChime();
      setIsFlipped(false);

      if (activeCardIndex + 1 < srsCards.length) {
        setActiveCardIndex((prev) => prev + 1);
      } else {
        // Reload deck
        loadAnalytics();
      }
    } catch (err) {
      console.error("Error reviewing card:", err);
    }
  };

  if (loading || !data) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>
        ⚡ Synthesizing cognitive telemetry...
      </div>
    );
  }

  // Generate SVG points for Radar Chart
  const radarMetrics = data.radar || [];
  const radius = 100;
  const centerX = 150;
  const centerY = 150;
  const numPoints = radarMetrics.length;

  const points = radarMetrics.map((item, i) => {
    const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
    const r = (item.score / 100) * radius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  const bgWebLevels = [0.25, 0.5, 0.75, 1.0];

  const currentSrsCard = srsCards[activeCardIndex];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Metrics Row */}
      <div className="analytics-grid">
        <div className="metric-card col-span-3">
          <div className="metric-label">Metacognitive Precision</div>
          <div className="metric-val" style={{ color: "#38bdf8" }}>
            {Math.round(data.cognitiveMetrics.metacognitiveCalibration * 100)}%
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Accuracy of self-assessed confidence
          </p>
        </div>

        <div className="metric-card col-span-3">
          <div className="metric-label">Learning Velocity</div>
          <div className="metric-val" style={{ color: "#34d399" }}>
            {data.cognitiveMetrics.learningVelocity}x
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Concept acquisition efficiency factor
          </p>
        </div>

        <div className="metric-card col-span-3">
          <div className="metric-label">Cognitive Stamina</div>
          <div className="metric-val" style={{ color: "#a5b4fc" }}>
            {data.cognitiveMetrics.cognitiveStamina}%
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            High-focus sustained attention span
          </p>
        </div>

        <div className="metric-card col-span-3">
          <div className="metric-label">Total Answered</div>
          <div className="metric-val" style={{ color: "#fbbf24" }}>
            {data.cognitiveMetrics.totalQuestionsAnswered}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Calibrated diagnostic submissions
          </p>
        </div>
      </div>

      {/* Center Row: Radar Chart + Ebbinghaus Decay */}
      <div className="analytics-grid">
        {/* Radar Chart */}
        <div className="glass-panel col-span-6">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <Brain size={20} color="var(--accent-cyan)" /> Cognitive Competency Radar
              </h2>
              <div className="section-subtitle">Multidimensional skill profile across core disciplines</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
            <svg width="300" height="300" viewBox="0 0 300 300">
              {/* Background circular web */}
              {bgWebLevels.map((lvl, idx) => (
                <polygon
                  key={idx}
                  points={radarMetrics
                    .map((_, i) => {
                      const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
                      const r = lvl * radius;
                      return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                />
              ))}

              {/* Axis rays */}
              {radarMetrics.map((_, i) => {
                const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
                return (
                  <line
                    key={i}
                    x1={centerX}
                    y1={centerY}
                    x2={centerX + radius * Math.cos(angle)}
                    y2={centerY + radius * Math.sin(angle)}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Filled Mastery Polygon */}
              <polygon
                points={points}
                fill="rgba(6, 182, 212, 0.25)"
                stroke="#06b6d4"
                strokeWidth="2"
              />

              {/* Data points */}
              {radarMetrics.map((item, i) => {
                const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
                const r = (item.score / 100) * radius;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Labels */}
              {radarMetrics.map((item, i) => {
                const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
                const labelRadius = radius + 22;
                const x = centerX + labelRadius * Math.cos(angle);
                const y = centerY + labelRadius * Math.sin(angle);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    fill="var(--text-secondary)"
                    fontSize="9"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {item.metric.split(" ")[0]}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Ebbinghaus Forgetting Curve Forecast */}
        <div className="glass-panel col-span-6">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <Clock size={20} color="var(--accent-amber)" /> Ebbinghaus Retention Decay
              </h2>
              <div className="section-subtitle">Projected memory stability over 7 days</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {data.forgettingForecast?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--bg-surface)",
                  padding: "0.85rem 1rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", textTransform: "capitalize" }}>
                    {item.concept}
                  </div>
                  <div style={{ fontSize: "0.8rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted)" }}>Current: {item.currentMastery}%</span>
                    <span>→</span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: item.needsReview ? "var(--accent-rose)" : "var(--accent-emerald)"
                      }}
                    >
                      In 7d: {item.projectedIn7Days}%
                    </span>
                  </div>
                </div>

                <div className="mastery-bar-track" style={{ height: "5px" }}>
                  <div
                    className="mastery-bar-fill"
                    style={{
                      width: `${item.projectedIn7Days}%`,
                      background: item.needsReview
                        ? "linear-gradient(90deg, #f43f5e, #fb7185)"
                        : "linear-gradient(90deg, #10b981, #34d399)"
                    }}
                  />
                </div>

                {item.needsReview && (
                  <div style={{ fontSize: "0.72rem", color: "#fb7185", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <AlertCircle size={12} /> High decay risk — spaced review suggested before mastery drops!
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spaced Repetition (SRS) Flashcard Drill Deck */}
      <div className="glass-panel">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <RotateCw size={20} color="var(--accent-indigo)" /> SuperMemo SM-2 Spaced Repetition Drill
            </h2>
            <div className="section-subtitle">
              Dynamic flashcards generated from prior quiz errors to cement long-term retention
            </div>
          </div>
          <span className="meta-tag">
            {srsCards.length > 0 ? `Card ${activeCardIndex + 1} of ${srsCards.length}` : "Deck Empty"}
          </span>
        </div>

        {srsCards.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
            <CheckCircle size={32} color="var(--accent-emerald)" style={{ margin: "0 auto 0.5rem" }} />
            <p>All flashcards up to date! Continue quizzes to generate new review items.</p>
          </div>
        ) : (
          <div>
            <div
              className="srs-card-wrapper"
              onClick={() => {
                playClickTick();
                setIsFlipped(!isFlipped);
              }}
            >
              <div className={`srs-card-inner ${isFlipped ? "flipped" : ""}`}>
                {/* Front */}
                <div className="srs-card-front">
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.5rem" }}>
                      Prompt & Challenge (Click to reveal solution)
                    </div>
                    <h3 style={{ fontSize: "1.15rem", lineHeight: 1.5 }}>
                      {currentSrsCard?.front}
                    </h3>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <RotateCw size={13} /> Tap card to flip
                  </div>
                </div>

                {/* Back */}
                <div className="srs-card-back">
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--accent-emerald)", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.5rem" }}>
                      Key Retrieval Answer
                    </div>
                    <p style={{ fontSize: "1.05rem", color: "var(--text-primary)", lineHeight: 1.6 }}>
                      {currentSrsCard?.back}
                    </p>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Select how easily you recalled this to calibrate the next SM-2 interval:
                  </div>
                </div>
              </div>
            </div>

            {/* SRS Rating Actions */}
            {isFlipped && (
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", justifyContent: "center" }}>
                <button
                  className="btn-secondary"
                  style={{ borderColor: "rgba(244, 63, 94, 0.4)", color: "#fb7185" }}
                  onClick={() => handleSrsReview(1)}
                >
                  Hard (1 Day)
                </button>
                <button
                  className="btn-secondary"
                  style={{ borderColor: "rgba(245, 158, 11, 0.4)", color: "#fbbf24" }}
                  onClick={() => handleSrsReview(3)}
                >
                  Good (3 Days)
                </button>
                <button
                  className="btn-primary"
                  onClick={() => handleSrsReview(5)}
                >
                  Easy (7+ Days)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
