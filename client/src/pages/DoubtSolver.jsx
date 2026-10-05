import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Sparkles,
  Send,
  Code,
  BookOpen,
  CheckCircle2,
  Trash2,
  Search,
  Menu,
  Lightbulb,
  ArrowRight,
  Clock,
  ChevronRight
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { doubtService } from "../services/doubtService";
import { courseService } from "../services/courseService";

export default function DoubtSolver() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doubts, setDoubts] = useState([]);
  const [activeDoubt, setActiveDoubt] = useState(null);
  const [subject, setSubject] = useState("Computer Networks");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [isSolving, setIsSolving] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("All");

  const courses = courseService.getAllCourses();
  const availableSubjects = [
    "Computer Networks",
    "Python",
    "DBMS",
    "Cloud Computing",
    "Artificial Intelligence",
    "Data Structures",
    ...courses.filter((c) => c.isCustom).map((c) => c.title)
  ];

  useEffect(() => {
    const list = doubtService.getDoubts();
    setDoubts(list);
    if (list.length > 0) {
      setActiveDoubt(list[0]);
    }
  }, []);

  const handleAskDoubt = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please enter a title and question description.");
      return;
    }

    setIsSolving(true);
    try {
      const solved = await doubtService.solveDoubt({
        subject,
        title: title.trim(),
        description: description.trim(),
        codeSnippet: codeSnippet.trim()
      });

      const updatedList = doubtService.getDoubts();
      setDoubts(updatedList);
      setActiveDoubt(solved);

      // Clear form
      setTitle("");
      setDescription("");
      setCodeSnippet("");
    } catch (err) {
      console.error(err);
      alert("Failed to resolve doubt. Please try again.");
    } finally {
      setIsSolving(false);
    }
  };

  const handleQuickPrompt = (sampleTitle, sampleDesc, sampleSub = "Computer Networks", sampleCode = "") => {
    setSubject(sampleSub);
    setTitle(sampleTitle);
    setDescription(sampleDesc);
    setCodeSnippet(sampleCode);
  };

  const handleDeleteDoubt = (id, e) => {
    e.stopPropagation();
    const updated = doubtService.deleteDoubt(id);
    setDoubts(updated);
    if (activeDoubt?.id === id) {
      setActiveDoubt(updated[0] || null);
    }
  };

  const filteredDoubts = doubts.filter((d) => {
    const matchSub = selectedSubjectFilter === "All" || d.subject === selectedSubjectFilter;
    const matchSearch =
      d.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchSub && matchSearch;
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
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800 }}>AI Doubt Solver</h1>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                Instant step-by-step conceptual resolution, analogies, and code fixes
              </p>
            </div>
          </div>

          <div className="badge badge-primary">
            <Sparkles size={14} /> 24/7 AI Assistance
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          <div className="classroom-layout" style={{ gridTemplateColumns: "360px 1fr" }}>
            {/* Left Column: Ask Doubt Form & Solved History */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Ask New Doubt Card */}
              <div className="card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-light)" }}>
                  <HelpCircle size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: "1.1rem" }}>Ask a New Doubt</h3>
                </div>

                <form onSubmit={handleAskDoubt} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                      Subject / Domain
                    </label>
                    <select
                      className="chat-input-field"
                      style={{ width: "100%", background: "white", fontSize: "0.85rem" }}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    >
                      {availableSubjects.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                      Question / Core Doubt Title
                    </label>
                    <input
                      type="text"
                      className="chat-input-field"
                      style={{ width: "100%", fontSize: "0.85rem" }}
                      placeholder="e.g. Why does TCP have a 3-way handshake?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                      What are you confused about?
                    </label>
                    <textarea
                      className="chat-input-field"
                      style={{ width: "100%", height: "80px", resize: "vertical", fontSize: "0.82rem" }}
                      placeholder="Explain your confusion, theory question, or what behavior you expected..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                      Code Snippet or Error Log (Optional)
                    </label>
                    <textarea
                      className="chat-input-field"
                      style={{ width: "100%", height: "65px", fontFamily: "var(--font-mono)", fontSize: "0.8rem", resize: "vertical" }}
                      placeholder="// Optional code snippet or error message..."
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "0.25rem" }}
                    disabled={isSolving}
                  >
                    {isSolving ? (
                      <>
                        <Sparkles size={16} /> Solving with AI...
                      </>
                    ) : (
                      <>
                        <Send size={15} /> Resolve Doubt with AI
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Sample Prompts */}
                <div style={{ marginTop: "1.25rem", borderTop: "1px solid var(--border-light)", paddingTop: "0.85rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    Common College Exam Doubts:
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <button
                      type="button"
                      className="quick-query-pill"
                      style={{ textAlign: "left" }}
                      onClick={() => handleQuickPrompt("Why 3-way handshake in TCP instead of 2-way?", "If the server replies with SYN-ACK, why must the client ACK again?", "Computer Networks")}
                    >
                      🌐 Why TCP 3-Way Handshake?
                    </button>
                    <button
                      type="button"
                      className="quick-query-pill"
                      style={{ textAlign: "left" }}
                      onClick={() => handleQuickPrompt("Difference between Primary Key and Unique Key", "Both enforce uniqueness, when to use which in database design?", "DBMS")}
                    >
                      🗄️ Primary Key vs Unique Key
                    </button>
                    <button
                      type="button"
                      className="quick-query-pill"
                      style={{ textAlign: "left" }}
                      onClick={() => handleQuickPrompt("Why does recursion need a base case?", "What happens under the hood if base case is missing?", "Python", "def recurse(n):\n    return n + recurse(n-1)")}
                    >
                      🔄 Recursion Base Case & Stack Overflow
                    </button>
                  </div>
                </div>
              </div>

              {/* Resolved Doubts List */}
              <div className="card" style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Resolved Doubts ({doubts.length})</h4>
                  <span className="badge badge-gray" style={{ fontSize: "0.7rem" }}>
                    History
                  </span>
                </div>

                {/* Search in History */}
                <div style={{ position: "relative", marginBottom: "0.75rem" }}>
                  <Search size={14} style={{ position: "absolute", left: "10px", top: "10px", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    className="chat-input-field"
                    style={{ paddingLeft: "2rem", width: "100%", fontSize: "0.8rem", padding: "0.45rem 0.65rem 0.45rem 2rem" }}
                    placeholder="Search past doubts..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "320px", overflowY: "auto" }}>
                  {filteredDoubts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                      No doubts found matching search.
                    </div>
                  ) : (
                    filteredDoubts.map((d) => {
                      const isSelected = activeDoubt?.id === d.id;
                      return (
                        <div
                          key={d.id}
                          className={`lesson-nav-item ${isSelected ? "active" : ""}`}
                          style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}
                          onClick={() => setActiveDoubt(d)}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                            <span className="badge badge-primary" style={{ fontSize: "0.68rem" }}>
                              {d.subject}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteDoubt(d.id, e)}
                              style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
                              title="Delete doubt"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <div style={{ fontWeight: 600, fontSize: "0.84rem", color: isSelected ? "var(--primary)" : "var(--text-primary)", lineHeight: 1.3 }}>
                            {d.title}
                          </div>

                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            {new Date(d.resolvedAt).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Active Solved Doubt Studio */}
            <div>
              {activeDoubt ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Doubt Header Card */}
                  <div className="card" style={{ borderLeft: "5px solid var(--primary)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      <span className="badge badge-primary">
                        {activeDoubt.subject}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Clock size={13} /> Resolved {new Date(activeDoubt.resolvedAt).toLocaleString()}
                      </span>
                    </div>

                    <h2 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>
                      {activeDoubt.title}
                    </h2>

                    <div style={{ background: "var(--bg-surface)", padding: "0.85rem 1.1rem", borderRadius: "var(--radius-md)", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      <strong>Student Question:</strong> {activeDoubt.description}
                    </div>

                    {activeDoubt.codeSnippet && (
                      <div style={{ marginTop: "0.85rem" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                          Submitted Code / Context:
                        </div>
                        <pre style={{ background: "#0f172a", color: "#38bdf8", padding: "0.85rem", borderRadius: "var(--radius-md)", fontSize: "0.82rem", overflowX: "auto", fontFamily: "var(--font-mono)" }}>
                          <code>{activeDoubt.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* AI Resolution Card */}
                  <div className="card">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-light)" }}>
                      <Sparkles size={20} color="var(--primary)" />
                      <h3 style={{ fontSize: "1.15rem" }}>AI Conceptual Solution & Breakdown</h3>
                    </div>

                    {/* Core Explanation */}
                    <div style={{ background: "var(--primary-light)", border: "1px solid rgba(79, 70, 229, 0.2)", borderRadius: "var(--radius-md)", padding: "1.25rem", marginBottom: "1.5rem" }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--primary)", marginBottom: "0.4rem" }}>
                        💡 Direct Conceptual Explanation
                      </h4>
                      <p style={{ fontSize: "0.92rem", color: "var(--text-primary)", margin: 0, lineHeight: 1.6 }}>
                        {activeDoubt.aiSolution?.conceptExplanation}
                      </p>
                    </div>

                    {/* Detailed Analysis & Diagram */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                        🔍 Step-by-Step Pedagogical Breakdown
                      </h4>
                      <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
                        {activeDoubt.aiSolution?.detailedAnalysis}
                      </div>
                    </div>

                    {/* Code Fix / Working Illustration */}
                    {activeDoubt.aiSolution?.codeExample && (
                      <div style={{ marginBottom: "1.5rem" }}>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <Code size={16} color="var(--primary)" /> Verified Pattern & Code Example
                        </h4>
                        <pre style={{ background: "#0f172a", color: "#a5b4fc", padding: "1rem", borderRadius: "var(--radius-md)", fontSize: "0.85rem", overflowX: "auto", fontFamily: "var(--font-mono)", lineHeight: 1.6 }}>
                          <code>{activeDoubt.aiSolution.codeExample}</code>
                        </pre>
                      </div>
                    )}

                    {/* Key Invariant Takeaway */}
                    <div style={{ background: "#ecfdf5", border: "1px solid var(--color-strong-border)", borderRadius: "var(--radius-md)", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
                      <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-strong)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <CheckCircle2 size={16} /> Exam Takeaway to Memorize:
                      </h4>
                      <p style={{ fontSize: "0.88rem", color: "var(--text-primary)", margin: 0, fontWeight: 600 }}>
                        {activeDoubt.aiSolution?.keyTakeaway}
                      </p>
                    </div>

                    {/* Practice Nudge */}
                    {activeDoubt.aiSolution?.practiceTip && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-surface)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                          <strong>Recommended Next Step:</strong> {activeDoubt.aiSolution.practiceTip}
                        </div>
                        <Link to="/courses" className="btn btn-primary btn-sm">
                          Go to Lessons <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
                  <HelpCircle size={40} color="var(--primary)" style={{ margin: "0 auto 1rem" }} />
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>No Doubt Selected</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "400px", margin: "0 auto 1.5rem" }}>
                    Ask a question in the form on the left or select a past resolved doubt to review its step-by-step solution.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
