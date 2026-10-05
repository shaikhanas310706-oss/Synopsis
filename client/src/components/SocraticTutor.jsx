import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  Settings,
  Lightbulb,
  Key,
  CheckCircle,
  HelpCircle,
  Minimize2
} from "lucide-react";
import { api } from "../services/api";
import { playClickTick, playSuccessChime } from "../utils/audio";

export default function SocraticTutor({
  isOpen,
  onToggle,
  activeConceptId,
  currentQuestionContext
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm Nova, your AI Socratic learning partner. I'm here to build your first-principles understanding through analogies, hints, and targeted counter-examples rather than just giving away the answers.\n\nWhat are you exploring right now?"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [activeConcept, setActiveConcept] = useState(activeConceptId || "math_foundations");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeConceptId) {
      setActiveConcept(activeConceptId);
    }
  }, [activeConceptId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (customMessage = null) => {
    const textToSend = customMessage || inputText;
    if (!textToSend.trim() || loading) return;

    playClickTick();
    const userMsg = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const res = await api.sendTutorMessage(
        textToSend,
        activeConcept,
        currentQuestionContext,
        apiKey || null
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.reply,
          mode: res.mode,
          suggestedFollowUps: res.suggestedFollowUps
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I ran into a temporary hiccup connecting to the neural reasoning service. Try asking again!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    handleSend(promptText);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button className="tutor-trigger-btn" onClick={onToggle}>
          <div className="tutor-pulse-dot" />
          <Sparkles size={18} />
          <span>Ask Nova AI</span>
        </button>
      )}

      {/* Tutor Conversational Dock */}
      {isOpen && (
        <div className="tutor-window">
          {/* Header */}
          <div className="tutor-header">
            <div className="tutor-title-box">
              <div className="tutor-avatar">
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  Nova AI Tutor
                  <span className="brand-badge" style={{ fontSize: "0.6rem" }}>
                    Socratic
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)" }}>
                  Concept: {activeConcept.replace(/_/g, " ")}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.35rem" }}>
              <button
                className="btn-icon"
                style={{ width: "32px", height: "32px" }}
                title="API Key Settings"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings size={15} />
              </button>
              <button
                className="btn-icon"
                style={{ width: "32px", height: "32px" }}
                onClick={onToggle}
              >
                <Minimize2 size={15} />
              </button>
            </div>
          </div>

          {/* Optional Settings Panel (Custom API Key) */}
          {showSettings && (
            <div
              style={{
                background: "var(--bg-core)",
                padding: "1rem",
                borderBottom: "1px solid var(--border-subtle)",
                fontSize: "0.82rem"
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Key size={14} color="var(--accent-cyan)" /> Optional OpenAI / Gemini API Key
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                Nova operates out-of-the-box with our built-in pedagogical reasoning heuristics. You may optionally supply an API key for live external LLM streaming.
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="password"
                  placeholder="sk-..."
                  className="tutor-input"
                  style={{ fontSize: "0.8rem", padding: "0.4rem 0.6rem" }}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <button
                  className="btn-primary"
                  style={{ padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}
                  onClick={() => setShowSettings(false)}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="tutor-messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.role}`}>
                {msg.content}

                {/* Follow-up suggestions */}
                {msg.suggestedFollowUps && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginTop: "0.75rem" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>
                      Suggested Follow-Ups:
                    </div>
                    {msg.suggestedFollowUps.map((fu, i) => (
                      <button
                        key={i}
                        className="quick-prompt-pill"
                        style={{ textAlign: "left" }}
                        onClick={() => handleQuickPrompt(fu)}
                      >
                        → {fu}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble assistant" style={{ fontStyle: "italic", color: "var(--accent-cyan)" }}>
                ⚡ Nova is formulating a Socratic insight...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="quick-prompts-row">
            <button className="quick-prompt-pill" onClick={() => handleQuickPrompt("Can you give me an intuitive analogy for this?")}>
              💡 Intuitive Analogy
            </button>
            <button className="quick-prompt-pill" onClick={() => handleQuickPrompt("Give me a hint on this concept without giving away the answer.")}>
              🔍 Socratic Hint
            </button>
            <button className="quick-prompt-pill" onClick={() => handleQuickPrompt("What is the most common misconception students have here?")}>
              ⚠️ Common Pitfall
            </button>
            <button className="quick-prompt-pill" onClick={() => handleQuickPrompt("What are the prerequisites to understand this deeply?")}>
              🗺️ Prerequisites
            </button>
          </div>

          {/* Input Bar */}
          <form
            className="tutor-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="tutor-input"
              placeholder="Ask Nova a question or describe your thought process..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="submit"
              className="btn-icon"
              disabled={!inputText.trim() || loading}
              style={{ color: "var(--accent-cyan)" }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
