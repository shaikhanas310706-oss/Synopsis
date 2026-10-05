import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Award,
  Flame,
  Clock,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Play,
  ArrowRight,
  Menu,
  Calendar,
  CheckSquare
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from "recharts";
import Sidebar from "../components/Sidebar";
import { DashboardCard, ProgressBar } from "../components/DashboardCard";
import { RecommendationCard } from "../components/CourseCard";
import { storageService } from "../services/storage";
import { adaptiveLearningService } from "../services/adaptiveLearning";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(storageService.getUser());
  const [analysis, setAnalysis] = useState(adaptiveLearningService.analyzeStudentPerformance());
  const [weeklyActivity, setWeeklyActivity] = useState(storageService.getWeeklyActivity());
  const [courseProgress, setCourseProgress] = useState(storageService.getCourseProgress());

  useEffect(() => {
    // Refresh state from storage
    setUser(storageService.getUser());
    setAnalysis(adaptiveLearningService.analyzeStudentPerformance());
    setWeeklyActivity(storageService.getWeeklyActivity());
    setCourseProgress(storageService.getCourseProgress());
  }, []);

  // Format subject score chart data
  const subjectChartData = Object.entries(analysis.scores).map(([subject, score]) => ({
    subject,
    score,
    classification: adaptiveLearningService.classifyScore(score)
  }));

  const getBarColor = (score) => {
    if (score >= 80) return "#10b981"; // Strong
    if (score >= 50) return "#f59e0b"; // Average
    return "#ef4444"; // Weak
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              className="btn-icon"
              style={{ display: "inline-flex" }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Student Dashboard</h1>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                AI Adaptive Learning & Diagnostic Telemetry
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="badge badge-primary" style={{ padding: "0.4rem 0.8rem" }}>
              <Flame size={14} color="#f59e0b" fill="#f59e0b" />
              <span>{user.streakDays} Day Streak</span>
            </div>
            <Link to="/profile" className="btn btn-secondary btn-sm">
              {user.name}
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Welcome Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e1b4b, #312e81)",
              borderRadius: "var(--radius-xl)",
              padding: "2rem",
              color: "white",
              marginBottom: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.5rem",
              boxShadow: "var(--shadow-md)"
            }}
          >
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.15)", padding: "0.25rem 0.75rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                <Sparkles size={12} /> Adaptive Engine Active
              </div>
              <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "white", marginBottom: "0.4rem" }}>
                Welcome back, {user.name}! 👋
              </h2>
              <p style={{ color: "#c7d2fe", fontSize: "0.95rem", maxWidth: "600px", margin: 0 }}>
                {user.educationLevel} • Your overall competency average across all subjects is{" "}
                <strong style={{ color: "white" }}>{analysis.overallAverage}%</strong>.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link to="/recommendations" className="btn btn-primary" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
                <Sparkles size={16} /> View AI Learning Path
              </Link>
              <Link to="/quizzes" className="btn btn-secondary" style={{ background: "rgba(255,255,255,0.1)", color: "white", borderColor: "rgba(255,255,255,0.2)" }}>
                <CheckSquare size={16} /> Take Quiz
              </Link>
            </div>
          </div>

          {/* Core Stat Cards */}
          <div className="stats-grid">
            <DashboardCard
              title="Overall Progress"
              value={`${analysis.overallAverage}%`}
              subtitle="Bayesian knowledge index"
              icon={TrendingUp}
              badge={analysis.overallAverage >= 75 ? "On Track" : "Needs Review"}
              color="var(--primary)"
            />
            <DashboardCard
              title="Total Courses"
              value={user.totalCoursesCount || 6}
              subtitle="College semester curricula"
              icon={BookOpen}
              badge="Enrolled"
              color="#3b82f6"
            />
            <DashboardCard
              title="Completed Lessons"
              value={user.completedLessonsCount || 18}
              subtitle="Theory & video modules"
              icon={CheckCircle2}
              badge="+2 this week"
              color="var(--color-strong)"
            />
            <DashboardCard
              title="Learning Streak"
              value={`${user.streakDays || 5} Days`}
              subtitle="Consistent daily habit"
              icon={Flame}
              badge="Active"
              color="var(--color-average)"
            />
          </div>

          {/* AI-Powered Dynamic Recommendation Banner */}
          <RecommendationCard
            recommendation={analysis.primaryRecommendation}
            onActionClick={() => {}}
          />

          {/* Classification Breakdown: Strong, Average, Weak Areas */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem" }}>Topic Mastery Classification</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  Rule-Based Engine: Strong (≥80%), Average (50-79%), Weak (&lt;50%)
                </p>
              </div>
              <Link to="/recommendations" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                View Full Analysis →
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {/* Strong Areas */}
              <div style={{ background: "var(--color-strong-light)", border: "1px solid var(--color-strong-border)", borderRadius: "var(--radius-md)", padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, color: "var(--color-strong)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                  <Award size={16} /> Strong Areas (Score ≥ 80%)
                </div>
                {analysis.strongSubjects.map((s) => (
                  <div key={s.subject} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{s.subject}</span>
                    <span className="badge badge-strong">{s.score}%</span>
                  </div>
                ))}
              </div>

              {/* Average Areas */}
              <div style={{ background: "var(--color-average-light)", border: "1px solid var(--color-average-border)", borderRadius: "var(--radius-md)", padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, color: "var(--color-average)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                  <Sparkles size={16} /> Average Areas (50% - 79%)
                </div>
                {analysis.averageSubjects.map((s) => (
                  <div key={s.subject} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{s.subject}</span>
                    <span className="badge badge-average">{s.score}%</span>
                  </div>
                ))}
              </div>

              {/* Weak Areas */}
              <div style={{ background: "var(--color-weak-light)", border: "1px solid var(--color-weak-border)", borderRadius: "var(--radius-md)", padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, color: "var(--color-weak)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                  <AlertTriangle size={16} /> Weak Areas (Score &lt; 50%)
                </div>
                {analysis.weakSubjects.map((s) => (
                  <div key={s.subject} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{s.subject}</span>
                    <span className="badge badge-weak">{s.score}%</span>
                  </div>
                ))}
                <div style={{ fontSize: "0.75rem", color: "var(--color-weak)", marginTop: "0.5rem" }}>
                  ⚡ Priority action needed in Computer Networks
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row: Subject-wise Progress & Weekly Activity */}
          <div className="content-grid-equal">
            {/* Subject Performance Bar Chart */}
            <div className="card">
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Subject-wise Mastery Level</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Current proficiency score by discipline
                </p>
              </div>

              <div style={{ width: "100%", height: "260px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="subject" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" interval={0} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val) => [`${val}%`, "Mastery"]}
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {subjectChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Activity Line/Bar Chart */}
            <div className="card">
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Weekly Study Hours</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Total active learning time (hours per day)
                </p>
              </div>

              <div style={{ width: "100%", height: "260px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(val) => [`${val} hrs`, "Study Time"]}
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="var(--primary)"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "var(--primary)" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Row: Recently Studied & Upcoming Activities */}
          <div className="content-grid-equal">
            {/* Recently Studied */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Recently Studied Topics</h3>
                <Link to="/courses" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                  All Courses →
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>OSI 7-Layer Reference Model</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Computer Networks • Lesson 1</div>
                  </div>
                  <Link to="/courses/cn-101" className="btn btn-primary btn-sm">
                    Resume <Play size={12} />
                  </Link>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>A* Heuristic Search & Minimax</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Artificial Intelligence • Lesson 1</div>
                  </div>
                  <Link to="/courses/ai-101" className="btn btn-secondary btn-sm">
                    Review
                  </Link>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Decorators & List Comprehensions</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Python Programming • Lesson 3</div>
                  </div>
                  <Link to="/courses/py-101" className="btn btn-secondary btn-sm">
                    Review
                  </Link>
                </div>
              </div>
            </div>

            {/* Upcoming Activities */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Upcoming Activities</h3>
                <span className="badge badge-primary">This Week</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.75rem", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "var(--radius-md)", background: "var(--color-weak-light)", color: "var(--color-weak)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <AlertTriangle size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>Computer Networks Remedial Quiz</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Due: Tomorrow • Recommended to boost weak score (45%)</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.75rem", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "var(--radius-md)", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Calendar size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>DBMS Normalization Practice Set</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Scheduled: Thursday • 5 practice scenario questions</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.75rem", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "var(--radius-md)", background: "var(--color-strong-light)", color: "var(--color-strong)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Award size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>Artificial Intelligence Milestone Challenge</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Unlock Advanced Neural Foundations (Score 88%)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
