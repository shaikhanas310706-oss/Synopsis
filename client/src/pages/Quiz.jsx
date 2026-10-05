import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Menu,
  CheckSquare,
  Award
} from "lucide-react";
import confetti from "canvas-confetti";
import Sidebar from "../components/Sidebar";
import { ProgressBar } from "../components/DashboardCard";
import { quizService, QUIZ_CATALOG } from "../services/quizService";
import { storageService } from "../services/storage";
import { adaptiveLearningService } from "../services/adaptiveLearning";

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active quiz selection
  const quiz = id ? quizService.getQuizById(id) : QUIZ_CATALOG[0];

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIndex]: optionIndex }
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Reset state if quiz changes
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setSubmitted(false);
    setResult(null);
  }, [id]);

  const currentQuestion = quiz.questions[currentQuestionIdx];
  const totalQuestions = quiz.questions.length;
  const isAnswered = userAnswers[currentQuestionIdx] !== undefined;

  const handleSelectOption = (optIdx) => {
    if (submitted) return;
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIdx]: optIdx
    });
  };

  const handleNext = () => {
    if (currentQuestionIdx < totalQuestions - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    const evalResult = quizService.evaluateSubmission(quiz, userAnswers);
    setResult(evalResult);
    setSubmitted(true);

    if (evalResult.percentage >= 80) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setSubmitted(false);
    setResult(null);
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
            <Link to="/quizzes" className="btn btn-secondary btn-sm">
              <ArrowLeft size={14} /> All Quizzes
            </Link>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>/</span>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{quiz.title}</span>
          </div>

          <div className="badge badge-primary">
            {quiz.subject}
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          <div className="quiz-card-wrapper">
            {!submitted ? (
              /* Question Stepper Card */
              <div className="card" style={{ padding: "2rem" }}>
                {/* Progress Indicator */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                    <span>Question {currentQuestionIdx + 1} of {totalQuestions}</span>
                    <span style={{ color: "var(--primary)" }}>{Math.round(((currentQuestionIdx + 1) / totalQuestions) * 100)}% Complete</span>
                  </div>
                  <ProgressBar
                    value={currentQuestionIdx + 1}
                    max={totalQuestions}
                    showPercentage={false}
                  />
                </div>

                {/* Question Statement */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <span className="badge badge-gray" style={{ marginBottom: "0.6rem" }}>
                    Topic: {currentQuestion.topicTag}
                  </span>
                  <h2 style={{ fontSize: "1.25rem", lineHeight: 1.4, color: "var(--text-primary)" }}>
                    {currentQuestion.question}
                  </h2>
                </div>

                {/* 4 Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = userAnswers[currentQuestionIdx] === idx;
                    const letters = ["A", "B", "C", "D"];

                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`quiz-option-btn ${isSelected ? "selected" : ""}`}
                        onClick={() => handleSelectOption(idx)}
                      >
                        <div className="quiz-option-letter">
                          {letters[idx]}
                        </div>
                        <span style={{ flex: 1 }}>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Controls */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1.25rem", borderTop: "1px solid var(--border-light)" }}>
                  <button
                    className="btn btn-secondary"
                    onClick={handlePrev}
                    disabled={currentQuestionIdx === 0}
                  >
                    <ArrowLeft size={16} /> Previous
                  </button>

                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {currentQuestionIdx < totalQuestions - 1 ? (
                      <button
                        className="btn btn-primary"
                        onClick={handleNext}
                        disabled={!isAnswered}
                      >
                        Next <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        style={{ backgroundColor: "var(--color-strong)" }}
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(userAnswers).length < totalQuestions}
                      >
                        Submit Quiz <CheckCircle2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Post-Quiz Results & Adaptive Feedback Card */
              <div className="card" style={{ padding: "2.5rem 2rem" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: result.percentage >= 80 ? "var(--color-strong-light)" : result.percentage >= 50 ? "var(--color-average-light)" : "var(--color-weak-light)",
                      color: result.percentage >= 80 ? "var(--color-strong)" : result.percentage >= 50 ? "var(--color-average)" : "var(--color-weak)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1rem"
                    }}
                  >
                    {result.percentage >= 80 ? <Award size={32} /> : result.percentage >= 50 ? <Sparkles size={32} /> : <AlertTriangle size={32} />}
                  </div>

                  <span className={`badge ${result.classification === "Strong" ? "badge-strong" : result.classification === "Average" ? "badge-average" : "badge-weak"}`} style={{ fontSize: "0.85rem", padding: "0.35rem 0.85rem", marginBottom: "0.75rem" }}>
                    Performance Level: {result.classification} ({result.percentage}%)
                  </span>

                  <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
                    Quiz Completed: {quiz.title}
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                    Your score has been stored in LocalStorage and dynamically updated your Adaptive Learning recommendations!
                  </p>
                </div>

                {/* Score Summary Metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", background: "var(--bg-surface)", padding: "1.25rem", borderRadius: "var(--radius-md)", marginBottom: "2rem", textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>TOTAL SCORE</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary)" }}>{result.score} / {result.totalQuestions}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>PERCENTAGE</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: result.percentage >= 80 ? "var(--color-strong)" : result.percentage >= 50 ? "var(--color-average)" : "var(--color-weak)" }}>{result.percentage}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>CORRECT</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-strong)" }}>{result.correctCount}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>INCORRECT</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-weak)" }}>{result.incorrectCount}</div>
                  </div>
                </div>

                {/* Topics Needing Improvement */}
                {result.topicsNeedingImprovement.length > 0 && (
                  <div style={{ background: "var(--color-weak-light)", border: "1px solid var(--color-weak-border)", padding: "1rem 1.25rem", borderRadius: "var(--radius-md)", marginBottom: "2rem" }}>
                    <div style={{ fontWeight: 700, color: "var(--color-weak)", fontSize: "0.9rem", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <AlertTriangle size={16} /> Topics Identified for Improvement:
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", margin: 0 }}>
                      Based on your incorrect answers, the AI recommends revising:{" "}
                      <strong>{result.topicsNeedingImprovement.join(", ")}</strong>.
                    </p>
                  </div>
                )}

                {/* Question-by-Question Review */}
                <div style={{ marginBottom: "2rem" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Answer Breakdown & Detailed Explanations</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {result.questionReview.map((rev, idx) => (
                      <div key={idx} style={{ padding: "1rem", borderRadius: "var(--radius-md)", border: `1px solid ${rev.isCorrect ? "var(--color-strong-border)" : "var(--color-weak-border)"}`, background: rev.isCorrect ? "var(--color-strong-light)" : "var(--color-weak-light)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                          {rev.isCorrect ? <CheckCircle2 size={18} color="var(--color-strong)" /> : <XCircle size={18} color="var(--color-weak)" />}
                          <span>Question {idx + 1}: {rev.questionText}</span>
                        </div>
                        <div style={{ fontSize: "0.82rem", marginBottom: "0.25rem" }}>
                          <strong>Your Answer:</strong> {rev.selectedOption} {!rev.isCorrect && <span style={{ color: "var(--color-weak)" }}>(Incorrect)</span>}
                        </div>
                        {!rev.isCorrect && (
                          <div style={{ fontSize: "0.82rem", color: "var(--color-strong)", fontWeight: 600, marginBottom: "0.25rem" }}>
                            <strong>Correct Answer:</strong> {rev.correctOption}
                          </div>
                        )}
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.4rem", fontStyle: "italic" }}>
                          <strong>Explanation:</strong> {rev.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem" }}>
                  <button className="btn btn-secondary" onClick={handleRetake}>
                    <RotateCcw size={16} /> Retake Quiz
                  </button>

                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <Link to="/recommendations" className="btn btn-primary">
                      <Sparkles size={16} /> View Updated AI Learning Path
                    </Link>
                    <Link to="/dashboard" className="btn btn-secondary">
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
