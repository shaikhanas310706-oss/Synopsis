import React, { useState } from "react";
import { Bot, Sparkles, Menu, HelpCircle, BookOpen, Lightbulb } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ChatBot from "../components/ChatBot";

export default function StudyAssistant() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800 }}>AI Study Assistant</h1>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                Interactive conversational tutor for college computer science & engineering concepts
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          <div className="content-grid-2">
            {/* Left: Chatbot Interface */}
            <div>
              <ChatBot />
            </div>

            {/* Right: Helpful Context & Sample Prompts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: "var(--primary)", fontWeight: 700 }}>
                  <Lightbulb size={18} /> How to Use Your Assistant
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
                  The AI Study Assistant is equipped with simulated knowledge across Python, DBMS, Computer Networks, Cloud Computing, and Artificial Intelligence.
                </p>

                <div style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Recommended Questions to Ask:
                </div>
                <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  <li><em>"Explain recursion with a real-world analogy"</em></li>
                  <li><em>"What is cloud computing and the 3 service models?"</em></li>
                  <li><em>"Explain DBMS and why Normalization matters"</em></li>
                  <li><em>"Explain the OSI 7-layer model simply"</em></li>
                  <li><em>"Give me practice questions for Computer Networks"</em></li>
                  <li><em>"Explain the TCP 3-way handshake step-by-step"</em></li>
                </ul>
              </div>

              <div className="card" style={{ background: "var(--primary-light)", border: "1px solid rgba(79, 70, 229, 0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--primary)", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                  <Sparkles size={16} /> Pedagogical Design
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                  This interface simulates an AI LLM tutor designed for college exam preparation. When integrated with live cloud APIs (e.g. OpenAI or Gemini), backend keys are securely managed via server proxies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
