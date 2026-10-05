import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Brain,
  HelpCircle,
  Lightbulb
} from "lucide-react";
import confetti from "canvas-confetti";
import { api } from "../services/api";
import { playSuccessChime, playIncorrectTone, playClickTick, playStreakChime } from "../utils/audio";

export default function AdaptiveQuizModal({
  concept,
  onClose,
  onMasteryUpdated,
  onOpenTutorWithContext
}) {
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredIds, setAnsweredIds] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [confidence, setConfidence] = useState("medium"); // low | medium | high
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNextQuestion([]);
  }, [concept]);

  const loadNextQuestion = async (existingAnswered = answeredIds) => {
    setLoading(true);
    setFeedback(null);
    setSelectedOptionId(null);
    setError(null);

    try {
      const data = await api.getNextAdaptiveQuestion(concept.id, existingAnswered);
      setCurrentQuestion(data.question);
    } catch (err) {
      console.error(err);
      setError("Unable to load adaptive question. You may have completed all items in this module!");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optId) => {
    if (feedback) return;
    playClickTick();
    setSelectedOptionId(optId);
  };

  const handleConfidenceChange = (lvl) => {
    if (feedback) return;
    playClickTick();
    setConfidence(lvl);
  };

  const handleSubmit = async () => {
    if (!selectedOptionId || submitting || feedback) return;

    setSubmitting(true);
    try {
      const res = await api.submitAnswer(
        currentQuestion.id,
        selectedOptionId,
        confidence,
        concept.id
      );

      setFeedback(res);
      setAnsweredIds((prev) => [...prev, currentQuestion.id]);

      if (res.isCorrect) {
        playSuccessChime();
        if (res.leveledUp || res.updatedMastery >= 85) {
          playStreakChime();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } else {
        playIncorrectTone();
      }

      // Notify parent to refresh mastery graphs
      if (onMasteryUpdated) {
        onMasteryUpdated(concept.id, res.updatedMastery, res.activeLearner);
      }
    } catch (err) {
      console.error(err);
      setError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyBadge = (diff) => {
    if (diff <= 0.35) return <span className="difficulty-badge novice">Novice ({Math.round(diff * 100)})</span>;
    if (diff <= 0.65) return <span className="difficulty-badge intermediate">Intermediate ({Math.round(diff * 100)})</span>;
    if (diff <= 0.85) return <span className="difficulty-badge advanced">Advanced ({Math.round(diff * 100)})</span>;
    return <span className="difficulty-badge expert">Expert ({Math.round(diff * 100)})</span>;
  };

  return (
    <div className="quiz-modal-overlay" onClick={onClose}>
      <div className="quiz-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="quiz-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="brand-logo-icon" style={{ width: "32px", height: "32px" }}>
              <Brain size={18} />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", textTransform: "uppercase", fontWeight: 700 }}>
                IRT Adaptive Practice: {concept.category}
              </div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{concept.title}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {currentQuestion && (
              <div className="quiz-diagnostic-meter">
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Difficulty:</span>
                {getDifficultyBadge(currentQuestion.difficulty)}
                <span className="meta-tag" style={{ fontSize: "0.72rem" }}>
                  Bloom: {currentQuestion.bloomLevel}
                </span>
              </div>
            )}

            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="quiz-body">
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
              <div style={{ marginBottom: "1rem", color: "var(--accent-cyan)" }}>
                ⚡ Calibrating optimal question using Item Response Theory...
              </div>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <AlertTriangle size={36} color="#fbbf24" style={{ margin: "0 auto 1rem" }} />
              <p style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}>{error}</p>
              <button className="btn-secondary" onClick={() => loadNextQuestion([])}>
                Restart Module Pool
              </button>
            </div>
          ) : (
            currentQuestion && (
              <>
                <h2 className="question-title">{currentQuestion.questionText}</h2>

                {currentQuestion.codeSnippet && (
                  <pre className="question-code-block">
                    <code>{currentQuestion.codeSnippet}</code>
                  </pre>
                )}

                {/* Options List */}
                <div className="options-list">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    let optionClass = "option-item";
                    if (isSelected) optionClass += " selected";
                    if (feedback) {
                      optionClass += " disabled";
                      if (opt.id === feedback.correctOption?.id) {
                        optionClass += " correct-state";
                      } else if (isSelected && !feedback.isCorrect) {
                        optionClass += " incorrect-state";
                      }
                    }

                    return (
                      <div
                        key={opt.id}
                        className={optionClass}
                        onClick={() => handleOptionSelect(opt.id)}
                      >
                        <div className="option-radio">
                          {isSelected && <div style={{ width: "8px", height: "8px", background: "white", borderRadius: "50%" }} />}
                        </div>
                        <div className="option-text">{opt.text}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Metacognitive Confidence Selector */}
                {!feedback && (
                  <div className="confidence-selector">
                    <div className="confidence-header">
                      <span>Rate your confidence level:</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Feeds Bayesian calibration
                      </span>
                    </div>
                    <div className="confidence-pills">
                      <button
                        type="button"
                        className={`confidence-pill-btn ${confidence === "low" ? "active low" : ""}`}
                        onClick={() => handleConfidenceChange("low")}
                      >
                        🤔 Low (Educated Guess)
                      </button>
                      <button
                        type="button"
                        className={`confidence-pill-btn ${confidence === "medium" ? "active medium" : ""}`}
                        onClick={() => handleConfidenceChange("medium")}
                      >
                        ⚖️ Medium (Reasoned)
                      </button>
                      <button
                        type="button"
                        className={`confidence-pill-btn ${confidence === "high" ? "active high" : ""}`}
                        onClick={() => handleConfidenceChange("high")}
                      >
                        🎯 High (Certain)
                      </button>
                    </div>
                  </div>
                )}

                {/* Post-submission Feedback Panel */}
                {feedback && (
                  <div className="quiz-feedback-box">
                    <div className="feedback-header">
                      <div className={`feedback-status ${feedback.isCorrect ? "correct" : "incorrect"}`}>
                        {feedback.isCorrect ? (
                          <>
                            <CheckCircle2 size={22} /> Correct! +{feedback.xpGained} XP
                          </>
                        ) : (
                          <>
                            <XCircle size={22} /> Needs Reinforcement
                          </>
                        )}
                      </div>

                      <div className="mastery-delta-badge">
                        BKT Mastery: {feedback.priorMastery}% →{" "}
                        <span style={{ color: feedback.updatedMastery >= feedback.priorMastery ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                          {feedback.updatedMastery}%
                        </span>
                      </div>
                    </div>

                    {/* Metacognitive calibration alert */}
                    {feedback.calibration && (
                      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span>🧠 Metacognition:</span>
                        <strong style={{ color: feedback.calibration.score >= 0.7 ? "#34d399" : "#fbbf24" }}>
                          {feedback.calibration.type}
                        </strong>
                        <span>— {feedback.calibration.note}</span>
                      </div>
                    )}

                    {/* Misconception diagnostic pill */}
                    {feedback.misconception && (
                      <div>
                        <span className="misconception-pill">
                          <AlertTriangle size={14} /> Misconception Detected: {feedback.misconception}
                        </span>
                      </div>
                    )}

                    {/* Explanation */}
                    <div className="feedback-explanation">
                      <strong>Deep Explanation:</strong> {feedback.explanation}
                    </div>

                    {/* Socratic Assistant follow up button */}
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                      <button
                        className="btn-secondary"
                        style={{ fontSize: "0.82rem" }}
                        onClick={() => {
                          playClickTick();
                          onOpenTutorWithContext(concept.id, currentQuestion);
                        }}
                      >
                        <Sparkles size={14} /> Discuss with Nova AI Tutor
                      </button>
                    </div>
                  </div>
                )}
              </>
            )
          )}
        </div>

        {/* Footer Actions */}
        <div className="quiz-footer">
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Items completed: {answeredIds.length}
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            {!feedback ? (
              <button
                className="btn-primary"
                disabled={!selectedOptionId || submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Analyzing with BKT..." : "Submit Answer"}
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={() => {
                  playClickTick();
                  loadNextQuestion();
                }}
              >
                Next Calibrated Question <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
