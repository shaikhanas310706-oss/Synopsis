import React, { useState } from "react";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Flame,
  Award,
  Calendar,
  Menu,
  RotateCcw,
  CheckSquare,
  AlertTriangle
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
import { storageService } from "../services/storage";
import { adaptiveLearningService } from "../services/adaptiveLearning";

export default function Progress() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = storageService.getUser();
  const analysis = adaptiveLearningService.analyzeStudentPerformance();
  const quizHistory = storageService.getQuizHistory();
  const weeklyActivity = storageService.getWeeklyActivity();

  const subjectChartData = Object.entries(analysis.scores).map(([subject, score]) => ({
    subject,
    score
  }));

  const getBarColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
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
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Progress & Performance Analytics</h1>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                Comprehensive learning telemetry, quiz logs, and skill distribution
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          {/* Top Metrics Row */}
          <div className="stats-grid">
            <DashboardCard
              title="Overall Competency"
              value={`${analysis.overallAverage}%`}
              subtitle="Calculated across 5 subjects"
              icon={TrendingUp}
              badge={analysis.overallAverage >= 75 ? "Proficient" : "Average"}
              color="var(--primary)"
            />
            <DashboardCard
              title="Total Study Hours"
              value={`${user.learningHours || 24.5} hrs`}
              subtitle="Active session telemetry"
              icon={Clock}
              color="#3b82f6"
            />
            <DashboardCard
              title="Lessons Completed"
              value={user.completedLessonsCount || 18}
              subtitle="Out of 34 total lessons"
              icon={CheckCircle2}
              color="var(--color-strong)"
            />
            <DashboardCard
              title="Active Streak"
              value={`${user.streakDays || 5} Days`}
              subtitle="Daily review streak"
              icon={Flame}
              color="var(--color-average)"
            />
          </div>

          {/* Recharts Analytics Row */}
          <div className="content-grid-equal">
            {/* Subject Mastery Distribution */}
            <div className="card">
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Subject Mastery Distribution</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Current evaluation: Green (≥80%), Amber (50-79%), Red (&lt;50%)
                </p>
              </div>

              <div style={{ width: "100%", height: "280px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="subject" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" interval={0} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val) => [`${val}%`, "Mastery"]} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {subjectChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Study Hours & Efficiency */}
            <div className="card">
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Weekly Study Effort</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Hours spent and lessons completed by day
                </p>
              </div>

              <div style={{ width: "100%", height: "280px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(val, name) => [val, name === "hours" ? "Hours" : "Lessons"]} />
                    <Bar dataKey="hours" fill="var(--primary)" radius={[4, 4, 0, 0]} name="hours" />
                    <Bar dataKey="lessons" fill="#38bdf8" radius={[4, 4, 0, 0]} name="lessons" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Subject Mastery Table */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <div style={{ marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.15rem" }}>Subject-wise Competency Breakdown</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Real-time adaptive engine classifications for college curriculum
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {Object.entries(analysis.scores).map(([subject, score]) => {
                const classification = adaptiveLearningService.classifyScore(score);
                const color = getBarColor(score);

                return (
                  <div key={subject} style={{ padding: "1rem", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", background: "white" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{subject}</span>
                        <span className={`badge ${classification === "Strong" ? "badge-strong" : classification === "Average" ? "badge-average" : "badge-weak"}`}>
                          {classification}
                        </span>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: "1rem", color }}>
                        {score}%
                      </span>
                    </div>

                    <ProgressBar value={score} showPercentage={false} color={color} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quiz History Table */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h3 style={{ fontSize: "1.15rem" }}>Quiz History & Results Log</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  Stored in LocalStorage and dynamically fed to the adaptive algorithm
                </p>
              </div>
              <span className="badge badge-primary">{quizHistory.length} Quizzes Completed</span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                    <th style={{ padding: "0.75rem" }}>Date</th>
                    <th style={{ padding: "0.75rem" }}>Subject</th>
                    <th style={{ padding: "0.75rem" }}>Quiz Title</th>
                    <th style={{ padding: "0.75rem" }}>Score</th>
                    <th style={{ padding: "0.75rem" }}>Percentage</th>
                    <th style={{ padding: "0.75rem" }}>Classification</th>
                  </tr>
                </thead>
                <tbody>
                  {quizHistory.map((q) => (
                    <tr key={q.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "0.85rem 0.75rem", color: "var(--text-muted)" }}>{q.date}</td>
                      <td style={{ padding: "0.85rem 0.75rem", fontWeight: 600 }}>{q.subject}</td>
                      <td style={{ padding: "0.85rem 0.75rem" }}>{q.quizTitle}</td>
                      <td style={{ padding: "0.85rem 0.75rem", fontWeight: 700 }}>
                        {q.score} / {q.totalQuestions}
                      </td>
                      <td style={{ padding: "0.85rem 0.75rem", fontWeight: 800 }}>
                        {q.percentage}%
                      </td>
                      <td style={{ padding: "0.85rem 0.75rem" }}>
                        <span className={`badge ${q.status === "Strong" ? "badge-strong" : q.status === "Average" ? "badge-average" : "badge-weak"}`}>
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
