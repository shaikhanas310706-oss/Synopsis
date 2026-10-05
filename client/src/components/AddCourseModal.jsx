import React, { useState } from "react";
import { X, Plus, BookOpen, Clock, FileText, CheckCircle2, Trash2 } from "lucide-react";
import { courseService } from "../services/courseService";

export default function AddCourseModal({ isOpen, onClose, onCourseAdded }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Software Development");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [durationHours, setDurationHours] = useState(8);
  const [description, setDescription] = useState("");

  // Lessons builder
  const [lessons, setLessons] = useState([
    {
      id: `l-${Date.now()}-1`,
      title: "Lesson 1: Foundations & Core Concepts",
      duration: "20 mins",
      videoPlaceholderTitle: "Introductory Lecture & Architecture Overview",
      videoDuration: "15:00",
      notes: "Write your study notes and explanations here...",
      keyConcepts: "Fundamental abstractions, Core syntax",
      practiceQ: "What is the primary purpose of this topic?",
      practiceA: "To build a robust foundational mental model."
    }
  ]);

  const handleAddLesson = () => {
    setLessons([
      ...lessons,
      {
        id: `l-${Date.now()}-${lessons.length + 1}`,
        title: `Lesson ${lessons.length + 1}: Key Principles & Practice`,
        duration: "25 mins",
        videoPlaceholderTitle: `Topic Deep Dive Part ${lessons.length + 1}`,
        videoDuration: "18:00",
        notes: "Detailed notes, code examples, and theoretical breakdown.",
        keyConcepts: "Key concept 1, Key concept 2",
        practiceQ: "What is the main challenge addressed here?",
        practiceA: "Handling edge cases and scalability."
      }
    ]);
  };

  const handleLessonChange = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };

  const handleDeleteLesson = (index) => {
    if (lessons.length <= 1) {
      alert("A course must have at least one lesson.");
      return;
    }
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please provide a course title and description.");
      return;
    }

    const formattedCourse = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category,
      difficulty,
      description: description.trim(),
      durationHours: Number(durationHours) || 8,
      rating: 5.0,
      badge: "Self-Paced Custom",
      color: "#8b5cf6",
      instructor: "Self-Directed Student",
      totalLessons: lessons.length,
      modules: [
        {
          id: `mod-custom-1`,
          title: "Module 1: Self-Paced Curriculum",
          lessons: lessons.map((l) => ({
            id: l.id,
            title: l.title,
            duration: l.duration,
            videoPlaceholderTitle: l.videoPlaceholderTitle,
            videoDuration: l.videoDuration,
            notes: l.notes,
            keyConcepts: l.keyConcepts.split(",").map((k) => k.trim()).filter(Boolean),
            practiceQuestions: [
              {
                q: l.practiceQ,
                a: l.practiceA
              }
            ]
          }))
        }
      ]
    };

    courseService.addCustomCourse(formattedCourse);
    if (onCourseAdded) onCourseAdded(formattedCourse);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem"
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: "760px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
          boxShadow: "var(--shadow-xl)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div className="brand-icon" style={{ width: "36px", height: "36px" }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Add Self-Paced Custom Course</h2>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                Design your own curriculum and learn at your personalized speed
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Basic Course Info */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.35rem" }}>
              Course Title
            </label>
            <input
              type="text"
              className="chat-input-field"
              style={{ width: "100%" }}
              placeholder="e.g. Modern Full-Stack Web Development, Scikit-Learn ML"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Category
              </label>
              <select
                className="chat-input-field"
                style={{ width: "100%", background: "white" }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Software Development">Software Development</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Web Development">Web Development</option>
                <option value="Data & Storage">Data & Storage</option>
                <option value="Networking & Protocols">Networking & Protocols</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Computer Science Core">Computer Science Core</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Difficulty
              </label>
              <select
                className="chat-input-field"
                style={{ width: "100%", background: "white" }}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Est. Duration (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                className="chat-input-field"
                style={{ width: "100%" }}
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.35rem" }}>
              Course Overview & Objectives
            </label>
            <textarea
              className="chat-input-field"
              style={{ width: "100%", height: "70px", resize: "vertical" }}
              placeholder="What will you master in this self-paced course?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Lessons Section */}
          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>Curriculum Lessons ({lessons.length})</h4>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                  Build out the modules you will study at your own speed
                </p>
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddLesson}>
                <Plus size={14} /> Add Another Lesson
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  style={{
                    background: "var(--bg-surface)",
                    padding: "1rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--primary)" }}>
                      Lesson #{idx + 1}
                    </span>
                    {lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteLesson(idx)}
                        style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
                        title="Delete lesson"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.75rem" }}>
                    <input
                      type="text"
                      className="chat-input-field"
                      style={{ background: "white" }}
                      placeholder="Lesson Title"
                      value={lesson.title}
                      onChange={(e) => handleLessonChange(idx, "title", e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="chat-input-field"
                      style={{ background: "white" }}
                      placeholder="Duration (e.g. 25 mins)"
                      value={lesson.duration}
                      onChange={(e) => handleLessonChange(idx, "duration", e.target.value)}
                    />
                  </div>

                  <textarea
                    className="chat-input-field"
                    style={{ width: "100%", height: "65px", background: "white", resize: "vertical", fontSize: "0.82rem" }}
                    placeholder="Study Notes, theory breakdown, or code snippets for this lesson..."
                    value={lesson.notes}
                    onChange={(e) => handleLessonChange(idx, "notes", e.target.value)}
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <input
                      type="text"
                      className="chat-input-field"
                      style={{ background: "white", fontSize: "0.8rem" }}
                      placeholder="Practice Question"
                      value={lesson.practiceQ}
                      onChange={(e) => handleLessonChange(idx, "practiceQ", e.target.value)}
                    />
                    <input
                      type="text"
                      className="chat-input-field"
                      style={{ background: "white", fontSize: "0.8rem" }}
                      placeholder="Practice Answer"
                      value={lesson.practiceA}
                      onChange={(e) => handleLessonChange(idx, "practiceA", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} /> Save & Add to My Courses
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
