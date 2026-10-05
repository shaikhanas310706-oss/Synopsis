import React, { useState } from "react";
import { CheckSquare, Search, Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { QuizCard } from "../components/CourseCard";
import { QUIZ_CATALOG } from "../services/quizService";
import { storageService } from "../services/storage";

export default function Quizzes() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [search, setSearch] = useState("");

  const scores = storageService.getSubjectScores();
  const subjects = ["All", "Computer Networks", "Python", "DBMS", "Artificial Intelligence", "Cloud Computing"];

  const filteredQuizzes = QUIZ_CATALOG.filter((q) => {
    const matchSubject = selectedSubject === "All" || q.subject === selectedSubject;
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) || q.description.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

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
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Adaptive Quizzes</h1>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                Diagnostic assessments that dynamically calibrate your learning recommendations
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          {/* Filter Toolbar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {subjects.map((sub) => (
                <button
                  key={sub}
                  className={`btn btn-sm ${selectedSubject === sub ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setSelectedSubject(sub)}
                >
                  {sub}
                </button>
              ))}
            </div>

            <div style={{ position: "relative", minWidth: "260px" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
              <input
                type="text"
                className="chat-input-field"
                style={{ paddingLeft: "2.25rem", width: "100%" }}
                placeholder="Search quizzes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Quizzes Grid */}
          <div className="content-grid-3">
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
