import React, { useState } from "react";
import {
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  Zap,
  Search,
  BookOpen,
  ArrowRight,
  HelpCircle
} from "lucide-react";
import { playClickTick } from "../utils/audio";

export default function SkillTree({
  currentCourse,
  onLaunchQuiz,
  onOpenTutorWithConcept
}) {
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!currentCourse) return null;

  const categories = ["all", ...new Set(currentCourse.nodes.map((n) => n.category))];

  const filteredNodes = currentCourse.nodes.filter((node) => {
    const matchesCat = filterCategory === "all" || node.category === filterCategory;
    const matchesSearch =
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getStatusBadge = (node) => {
    if (node.status === "mastered") {
      return (
        <span className="node-status-badge mastered">
          <CheckCircle2 size={13} /> Mastered ({node.masteryScore}%)
        </span>
      );
    }
    if (node.status === "in_progress") {
      return (
        <span className="node-status-badge in_progress">
          <Zap size={13} /> In Progress ({node.masteryScore}%)
        </span>
      );
    }
    if (node.status === "available") {
      return (
        <span className="node-status-badge available">
          <Play size={13} /> Ready ({node.masteryScore}%)
        </span>
      );
    }
    return (
      <span className="node-status-badge locked">
        <Lock size={13} /> Prereqs Required
      </span>
    );
  };

  const getBarGradient = (score) => {
    if (score >= 85) return "linear-gradient(90deg, #10b981, #34d399)";
    if (score >= 50) return "linear-gradient(90deg, #6366f1, #06b6d4)";
    return "linear-gradient(90deg, #f59e0b, #fbbf24)";
  };

  return (
    <div className="skill-tree-container">
      {/* Course Banner */}
      <div className="curriculum-hero">
        <div className="curriculum-hero-content">
          <div className="node-category" style={{ marginBottom: "0.5rem" }}>
            {currentCourse.category}
          </div>
          <h1 className="curriculum-hero-title">{currentCourse.title}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
            {currentCourse.description}
          </p>

          <div className="curriculum-meta-tags">
            {currentCourse.tags?.map((t) => (
              <span key={t} className="meta-tag">
                #{t}
              </span>
            ))}
            <span className="meta-tag">
              ⚡ {currentCourse.nodes.length} Adaptive Concept Nodes
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`role-btn ${filterCategory === cat ? "active" : ""}`}
              style={{ padding: "0.45rem 1rem", border: "1px solid var(--border-subtle)" }}
              onClick={() => {
                playClickTick();
                setFilterCategory(cat);
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "260px" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
          <input
            type="text"
            className="tutor-input"
            style={{ paddingLeft: "2.2rem", width: "100%" }}
            placeholder="Search concepts or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* DAG Skill Nodes Grid */}
      <div className="tree-grid">
        {filteredNodes.map((node) => {
          const isLocked = node.status === "locked";

          return (
            <div
              key={node.id}
              className={`concept-node-card ${node.status}`}
              onClick={() => {
                if (!isLocked) {
                  playClickTick();
                  onLaunchQuiz(node);
                }
              }}
            >
              <div>
                <div className="node-header">
                  <span className="node-category">{node.category}</span>
                  {getStatusBadge(node)}
                </div>

                <h3 className="node-title">{node.title}</h3>
                <p className="node-desc">{node.description}</p>

                {node.prerequisites && node.prerequisites.length > 0 && (
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                    Prerequisites:{" "}
                    <span style={{ color: "var(--text-secondary)" }}>
                      {node.prerequisites.join(", ").replace(/_/g, " ")}
                    </span>
                  </div>
                )}
              </div>

              <div className="node-footer">
                <div className="mastery-meter-compact">
                  <div className="mastery-labels">
                    <span>BKT Mastery</span>
                    <span style={{ color: "var(--text-primary)" }}>{node.masteryScore}%</span>
                  </div>
                  <div className="mastery-bar-track">
                    <div
                      className="mastery-bar-fill"
                      style={{
                        width: `${Math.max(4, node.masteryScore)}%`,
                        background: getBarGradient(node.masteryScore)
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn-icon"
                    title="Ask Socratic AI about this concept"
                    onClick={(e) => {
                      e.stopPropagation();
                      playClickTick();
                      onOpenTutorWithConcept(node.id);
                    }}
                  >
                    <Sparkles size={16} />
                  </button>

                  <button
                    className={isLocked ? "btn-secondary" : "btn-primary"}
                    disabled={isLocked}
                    style={{ padding: "0.5rem 0.9rem", fontSize: "0.8rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLocked) {
                        playClickTick();
                        onLaunchQuiz(node);
                      }
                    }}
                  >
                    {isLocked ? (
                      <>
                        <Lock size={14} /> Locked
                      </>
                    ) : node.status === "mastered" ? (
                      <>
                        <Zap size={14} /> Practice
                      </>
                    ) : (
                      <>
                        <Play size={14} /> Start Drill
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
