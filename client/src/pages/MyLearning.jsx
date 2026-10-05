import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookmarkCheck, BookOpen, Play, CheckCircle2, Menu, Clock, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { ProgressBar } from "../components/DashboardCard";
import AddCourseModal from "../components/AddCourseModal";
import { courseService } from "../services/courseService";
import { storageService } from "../services/storage";

export default function MyLearning() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [courses, setCourses] = useState(courseService.getAllCourses());
  const progressMap = storageService.getCourseProgress();

  const handleCourseAdded = () => {
    setCourses(courseService.getAllCourses());
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
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800 }}>My Learning</h1>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                Continue your enrolled courses and review completed modules
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={15} /> Add Custom Course
          </button>
        </header>


        {/* Content */}
        <div className="dashboard-content">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {courses.map((course) => {
              const progData = progressMap[course.id] || { completedLessons: [], progress: 0 };

              return (
                <div key={course.id} className="card card-hover" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
                  <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", minWidth: "280px", flex: 1 }}>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "var(--radius-md)",
                        background: `${course.color || "var(--primary)"}15`,
                        color: course.color || "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <BookOpen size={24} />
                    </div>

                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
                        {course.category}
                      </div>
                      <h3 style={{ fontSize: "1.15rem", marginBottom: "0.25rem" }}>{course.title}</h3>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        {progData.completedLessons?.length || 0} of {course.totalLessons} lessons completed • {course.durationHours} hours
                      </div>
                    </div>
                  </div>

                  <div style={{ minWidth: "200px", flex: 1 }}>
                    <ProgressBar
                      value={progData.progress}
                      label="Overall Completion"
                      color={progData.progress >= 80 ? "var(--color-strong)" : "var(--primary)"}
                    />
                  </div>

                  <div>
                    <Link to={`/courses/${course.id}`} className="btn btn-primary btn-sm">
                      <Play size={14} /> Continue Course
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AddCourseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCourseAdded={handleCourseAdded}
      />
    </div>
  );
}

