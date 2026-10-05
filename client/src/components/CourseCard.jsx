import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Star, Play, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { ProgressBar } from "./DashboardCard";

export function CourseCard({ course, progress = 0 }) {
  const getBadgeClass = (badge) => {
    if (badge?.includes("Weak")) return "badge badge-weak";
    if (badge?.includes("Strong")) return "badge badge-strong";
    if (badge?.includes("Average")) return "badge badge-average";
    return "badge badge-primary";
  };

  return (
    <div className="card card-hover course-card">
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
          <div
            className="course-icon-box"
            style={{ backgroundColor: `${course.color || "var(--primary)"}15`, color: course.color || "var(--primary)" }}
          >
            <BookOpen size={22} />
          </div>
          <span className={getBadgeClass(course.badge)}>
            {course.badge || course.difficulty}
          </span>
        </div>

        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: "0.25rem" }}>
          {course.category}
        </div>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          {course.title}
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
          {course.description}
        </p>
      </div>

      <div>
        <div style={{ marginBottom: "1rem" }}>
          <ProgressBar
            value={progress}
            label="Course Completion"
            color={progress >= 80 ? "var(--color-strong)" : progress > 0 ? "var(--primary)" : "var(--border-dark)"}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", gap: "0.85rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Clock size={13} /> {course.durationHours} hrs
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Star size={13} color="#f59e0b" fill="#f59e0b" /> {course.rating}
            </span>
          </div>

          <Link to={`/courses/${course.id}`} className="btn btn-primary btn-sm">
            {progress > 0 ? (
              <>
                <Play size={13} /> Continue
              </>
            ) : (
              <>
                Start Course <ArrowRight size={13} />
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RecommendationCard({ recommendation, onActionClick }) {
  if (!recommendation) return null;

  const isWeak = recommendation.severity === "weak";
  const isAverage = recommendation.severity === "average";

  return (
    <div className={`ai-recommendation-banner ${isWeak ? "weak-priority" : ""}`}>
      <div>
        <div className="ai-rec-header">
          <span className="ai-sparkle-badge">
            <Sparkles size={14} /> AI-Powered Recommendation
          </span>
          {isWeak && (
            <span className="badge badge-weak">
              <AlertTriangle size={12} /> Needs Attention
            </span>
          )}
          {isAverage && (
            <span className="badge badge-average">
              Targeted Practice
            </span>
          )}
        </div>

        <h3 className="ai-rec-title">{recommendation.title}</h3>
        <p className="ai-rec-message">{recommendation.message}</p>

        <div style={{ marginTop: "0.6rem", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 600 }}>
          Recommended Next Action:{" "}
          <span style={{ color: isWeak ? "var(--color-weak)" : "var(--primary)" }}>
            {recommendation.recommendedStep}
          </span>
        </div>
      </div>

      <div style={{ flexShrink: 0 }}>
        <Link
          to={recommendation.courseId ? `/courses/${recommendation.courseId}` : "/quizzes"}
          className={`btn ${isWeak ? "btn-primary" : "btn-secondary"}`}
          style={isWeak ? { backgroundColor: "var(--color-weak)", borderColor: "var(--color-weak)" } : {}}
          onClick={onActionClick}
        >
          {recommendation.suggestedAction} <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export function QuizCard({ quiz }) {
  return (
    <div className="card card-hover" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <span className="badge badge-primary">{quiz.subject}</span>
          <span className="badge badge-gray">{quiz.difficulty}</span>
        </div>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{quiz.title}</h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
          {quiz.description}
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.85rem", borderTop: "1px solid var(--border-light)" }}>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          ⚡ {quiz.totalQuestions} Questions • {quiz.estimatedMinutes} mins
        </div>
        <Link to={`/quiz/${quiz.id}`} className="btn btn-primary btn-sm">
          Take Quiz <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
