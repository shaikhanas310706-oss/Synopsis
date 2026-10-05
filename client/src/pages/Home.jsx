import React from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Target,
  Zap,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
  BarChart3,
  Bot
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { storageService } from "../services/storage";

export default function Home() {
  const isLoggedIn = storageService.isLoggedIn();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <section style={{ padding: "5rem 2rem 4rem", background: "linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)", borderBottom: "1px solid var(--border-color)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <div className="badge badge-primary" style={{ marginBottom: "1.25rem", padding: "0.4rem 0.9rem", fontSize: "0.85rem" }}>
            <Sparkles size={14} /> Next-Generation Personalized Education
          </div>

          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.75rem)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "1.25rem", lineHeight: 1.15 }}>
            Master Every Subject with an <br />
            <span style={{ background: "linear-gradient(135deg, var(--primary), #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AI Adaptive Learning Platform
            </span>
          </h1>

          <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", maxWidth: "750px", margin: "0 auto 2.5rem", lineHeight: 1.6 }}>
            Every student learns differently. Our intelligent platform continuously analyzes your quiz results, identifies strengths and weak areas, and dynamically tailors lessons and practice to maximize your college academic performance.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
            <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="btn btn-primary btn-lg">
              {isLoggedIn ? "Open Student Dashboard" : "Get Started Free"} <ArrowRight size={18} />
            </Link>
            <Link to="/courses" className="btn btn-secondary btn-lg">
              Explore Course Catalog
            </Link>
          </div>

          {/* Quick Platform Metrics Banner */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", background: "white", padding: "1.75rem", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)", border: "1px solid var(--border-color)" }}>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)" }}>Score &gt;= 80%</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-strong)" }}>Strong Area</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Advanced Challenges</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-average)" }}>50% - 79%</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-average)" }}>Average Area</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Targeted Practice</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-weak)" }}>Score &lt; 50%</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-weak)" }}>Weak Area</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Instant Remediation</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>100%</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)" }}>Personalized</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Dynamic Step-by-Step Path</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: "5rem 2rem", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>Workflow</span>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 800 }}>How the Adaptive Engine Works</h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              Four simple automated steps that turn knowledge gaps into academic strengths.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontWeight: 800, fontSize: "1.2rem" }}>
                1
              </div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Take Diagnostic Quiz</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                Solve interactive multiple-choice questions across core subjects with immediate response tracking.
              </p>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#ecfdf5", color: "var(--color-strong)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontWeight: 800, fontSize: "1.2rem" }}>
                2
              </div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>AI Performance Analysis</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                The engine evaluates accuracy and automatically classifies each topic into Strong, Average, or Weak.
              </p>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#fffbeb", color: "var(--color-average)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontWeight: 800, fontSize: "1.2rem" }}>
                3
              </div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Dynamic Learning Path</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                Weak topics receive prioritized revision modules, remedial videos, and step-by-step guidance.
              </p>
            </div>

            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontWeight: 800, fontSize: "1.2rem" }}>
                4
              </div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Mastery & Unlock</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                Re-quiz after revision to boost your score above 80%, unlocking advanced topics and XP badges!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section style={{ padding: "5rem 2rem", background: "var(--bg-page)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>Features</span>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 800 }}>Built for College Excellence</h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              Everything a computer science or engineering student needs to prepare for semester exams and interviews.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            <div className="card card-hover">
              <div style={{ color: "var(--primary)", marginBottom: "1rem" }}><Target size={28} /></div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Rule-Based Adaptive Engine</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                Transparent, deterministic scoring logic that classifies topics into Strong (≥80%), Average (50-79%), and Weak (&lt;50%).
              </p>
            </div>

            <div className="card card-hover">
              <div style={{ color: "var(--color-strong)", marginBottom: "1rem" }}><Bot size={28} /></div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>AI Study Assistant</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                Interactive chatbot ready to explain complex computer science concepts simply, give practice queries, and break down algorithms.
              </p>
            </div>

            <div className="card card-hover">
              <div style={{ color: "var(--color-average)", marginBottom: "1rem" }}><BarChart3 size={28} /></div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Recharts Progress Analytics</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                Interactive visual graphs showing weekly study hours, subject performance trends, and complete quiz history.
              </p>
            </div>

            <div className="card card-hover">
              <div style={{ color: "var(--color-weak)", marginBottom: "1rem" }}><Zap size={28} /></div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Instant Weak-Area Alerts</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                The dashboard immediately alerts you if a subject slips below 50%, with one-click direct revision links.
              </p>
            </div>

            <div className="card card-hover">
              <div style={{ color: "var(--primary)", marginBottom: "1rem" }}><BookOpen size={28} /></div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Interactive Classroom</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                Complete courses with video lectures, structured markdown study notes, key concept takeaways, and practice checks.
              </p>
            </div>

            <div className="card card-hover">
              <div style={{ color: "var(--color-strong)", marginBottom: "1rem" }}><Award size={28} /></div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Zero Friction LocalStorage</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                Works 100% in your browser out of the box with zero setup, external backend dependencies, or paid API requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ padding: "5rem 2rem", background: "white", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "1rem" }}>
            Ready to Experience Personalized Learning?
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginBottom: "2rem" }}>
            Log in with our demo profile (Anas Shaikh) or register a new student account to explore the dashboard and adaptive quizzes.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/login" className="btn btn-primary btn-lg">
              Launch Demo Student Experience <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
