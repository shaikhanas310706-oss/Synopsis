import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Brain, BookOpen, User, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { storageService } from "../services/storage";

export default function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const user = storageService.getUser();

  return (
    <nav className="public-navbar">
      <Link to="/" className="brand-logo">
        <div className="brand-icon">
          <Brain size={22} />
        </div>
        <div>
          <span style={{ fontWeight: 800 }}>AI Adaptive</span>{" "}
          <span style={{ color: "var(--primary)" }}>Learning</span>
        </div>
      </Link>

      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/courses" className="nav-link">
            Courses
          </Link>
        </li>
        <li>
          <Link to="/quizzes" className="nav-link">
            Quizzes
          </Link>
        </li>
        {isLoggedIn && (
          <>
            <li>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/recommendations" className="nav-link">
                AI Recommendations
              </Link>
            </li>
          </>
        )}
      </ul>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              <LayoutDashboard size={15} /> Dashboard
            </Link>
            <Link to="/profile" className="btn btn-secondary btn-sm" title={user.name}>
              <User size={15} /> {user.name.split(" ")[0]}
            </Link>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                storageService.logout();
                if (onLogout) onLogout();
                navigate("/login");
              }}
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm">
              <LogIn size={15} /> Login
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm">
              Get Started Free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
