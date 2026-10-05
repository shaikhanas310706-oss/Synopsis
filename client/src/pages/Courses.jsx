import React, { useState } from "react";
import { Search, Filter, BookOpen, Menu, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { CourseCard } from "../components/CourseCard";
import AddCourseModal from "../components/AddCourseModal";
import { courseService } from "../services/courseService";
import { storageService } from "../services/storage";

export default function Courses() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [courses, setCourses] = useState(courseService.getAllCourses());

  const progressMap = storageService.getCourseProgress();

  const handleCourseAdded = () => {
    setCourses(courseService.getAllCourses());
  };

  const categories = ["All", "Networking & Protocols", "Software Development", "Data & Storage", "AI & Machine Learning", "Cloud & DevOps", "Computer Science Core", "Web Development"];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              className="btn-icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Course Catalog</h1>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                Explore personalized semester modules and interactive lessons
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
          {/* Filter & Search Toolbar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "2rem"
            }}
          >
            {/* Category Pills */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`btn btn-sm ${selectedCategory === cat ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div style={{ position: "relative", minWidth: "260px" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
              <input
                type="text"
                className="chat-input-field"
                style={{ paddingLeft: "2.25rem", width: "100%" }}
                placeholder="Search courses or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Courses Grid */}
          <div className="course-card-grid">
            {filteredCourses.map((course) => {
              const prog = progressMap[course.id]?.progress || 0;
              return (
                <CourseCard key={course.id} course={course} progress={prog} />
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Custom Course Modal */}
      <AddCourseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCourseAdded={handleCourseAdded}
      />
    </div>
  );
}

