import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Play,
  FileText,
  HelpCircle,
  ArrowLeft,
  Award,
  ChevronRight,
  Menu,
  Clock,
  Sparkles
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { ProgressBar } from "../components/DashboardCard";
import { courseService } from "../services/courseService";
import { storageService } from "../services/storage";

export default function CourseDetails() {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const course = courseService.getCourseById(id);

  // Active module & lesson selection
  const [activeLesson, setActiveLesson] = useState(course.modules[0]?.lessons[0]);
  const [courseProgress, setCourseProgress] = useState(storageService.getCourseProgress());
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    setCourseProgress(storageService.getCourseProgress());
  }, []);

  const courseProgData = courseProgress[course.id] || { completedLessons: [], progress: 0 };
  const isLessonCompleted = courseProgData.completedLessons?.includes(activeLesson?.id);

  const handleMarkCompleted = () => {
    if (!activeLesson) return;
    storageService.markLessonComplete(course.id, activeLesson.id);
    setCourseProgress(storageService.getCourseProgress());
    setJustCompleted(true);
    setTimeout(() => setJustCompleted(false), 3000);
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
            <Link to="/courses" className="btn btn-secondary btn-sm">
              <ArrowLeft size={14} /> Back to Courses
            </Link>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>/</span>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{course.title}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", minWidth: "200px" }}>
            <ProgressBar
              value={courseProgData.progress}
              label="Course Progress"
              color={courseProgData.progress >= 80 ? "var(--color-strong)" : "var(--primary)"}
            />
          </div>
        </header>

        {/* Learning Classroom Layout */}
        <div className="dashboard-content">
          <div className="classroom-layout">
            {/* Left: Modules & Lessons Navigation Sidebar */}
            <div className="classroom-sidebar">
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                  Curriculum Outline
                </div>
                <h3 style={{ fontSize: "1.1rem" }}>{course.title}</h3>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  {courseProgData.completedLessons?.length || 0} of {course.totalLessons} lessons completed
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {course.modules.map((mod) => (
                  <div key={mod.id}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                      {mod.title}
                    </div>

                    {mod.lessons.map((lesson) => {
                      const completed = courseProgData.completedLessons?.includes(lesson.id);
                      const isCurrent = activeLesson?.id === lesson.id;

                      return (
                        <div
                          key={lesson.id}
                          className={`lesson-nav-item ${isCurrent ? "active" : ""}`}
                          onClick={() => {
                            setActiveLesson(lesson);
                            setIsVideoPlaying(false);
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden" }}>
                            {completed ? (
                              <CheckCircle2 size={16} color="var(--color-strong)" style={{ flexShrink: 0 }} />
                            ) : (
                              <Play size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
                            )}
                            <span style={{ fontSize: "0.82rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {lesson.title}
                            </span>
                          </div>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", flexShrink: 0 }}>
                            {lesson.duration}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Active Lesson Studio */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {activeLesson ? (
                <>
                  {/* Video Player UI / Placeholder */}
                  <div className="video-player-box">
                    {!isVideoPlaying ? (
                      <>
                        <div className="video-play-btn" onClick={() => setIsVideoPlaying(true)}>
                          <Play size={26} fill="white" style={{ marginLeft: "4px" }} />
                        </div>
                        <div style={{ marginTop: "1rem", textAlign: "center", padding: "0 1.5rem" }}>
                          <h4 style={{ color: "white", fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                            {activeLesson.videoPlaceholderTitle}
                          </h4>
                          <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                            Duration: {activeLesson.videoDuration} • Instructor: {course.instructor}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: "center", padding: "2rem" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                          <Play size={24} fill="white" />
                        </div>
                        <h4 style={{ color: "white", fontSize: "1.15rem", marginBottom: "0.5rem" }}>
                          Interactive Video Lesson in Progress
                        </h4>
                        <p style={{ color: "#94a3b8", fontSize: "0.85rem", maxWidth: "450px", margin: "0 auto 1.5rem" }}>
                          Streaming high-definition video lecture: "{activeLesson.title}"
                        </p>
                        <button className="btn btn-secondary btn-sm" onClick={() => setIsVideoPlaying(false)}>
                          Pause Video
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Lesson Controls & Completion Action */}
                  <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <span className="badge badge-primary" style={{ marginBottom: "0.35rem" }}>
                        {activeLesson.duration}
                      </span>
                      <h2 style={{ fontSize: "1.35rem" }}>{activeLesson.title}</h2>
                    </div>

                    <div>
                      {isLessonCompleted ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-strong)", fontWeight: 700, fontSize: "0.9rem" }}>
                          <CheckCircle2 size={18} /> Lesson Completed
                        </div>
                      ) : (
                        <button className="btn btn-primary" onClick={handleMarkCompleted}>
                          <CheckCircle2 size={16} /> Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>

                  {justCompleted && (
                    <div style={{ background: "var(--color-strong-light)", border: "1px solid var(--color-strong-border)", color: "var(--color-strong)", padding: "1rem", borderRadius: "var(--radius-md)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <CheckCircle2 size={18} /> Great progress! Lesson marked complete. Course progress updated in your dashboard.
                    </div>
                  )}

                  {/* Notes & Key Concepts Tabs */}
                  <div className="card">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border-light)" }}>
                      <FileText size={18} color="var(--primary)" />
                      <h3 style={{ fontSize: "1.15rem" }}>Study Notes & Key Theoretical Concepts</h3>
                    </div>

                    <div style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: "2rem" }}>
                      {activeLesson.notes}
                    </div>

                    {/* Key Concepts Takeaways */}
                    {activeLesson.keyConcepts && (
                      <div style={{ background: "var(--bg-surface)", padding: "1.25rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <Sparkles size={16} color="var(--primary)" /> Key Takeaways to Remember:
                        </h4>
                        <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          {activeLesson.keyConcepts.map((kc, idx) => (
                            <li key={idx} style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>
                              {kc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Practice Check Questions */}
                    {activeLesson.practiceQuestions && (
                      <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1.25rem" }}>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <HelpCircle size={16} color="var(--color-strong)" /> Quick Comprehension Check:
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          {activeLesson.practiceQuestions.map((pq, idx) => (
                            <div key={idx} style={{ background: "white", border: "1px solid var(--border-color)", padding: "0.85rem 1rem", borderRadius: "var(--radius-md)" }}>
                              <div style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.25rem" }}>
                                Q: {pq.q}
                              </div>
                              <div style={{ fontSize: "0.82rem", color: "var(--color-strong)", fontWeight: 600 }}>
                                Correct Answer: {pq.a}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                  <p>Select a lesson from the left outline to begin.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
