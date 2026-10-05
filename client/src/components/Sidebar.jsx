import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BookmarkCheck,
  CheckSquare,
  Sparkles,
  Bot,
  TrendingUp,
  User,
  LogOut,
  X,
  Brain,
  HelpCircle
} from "lucide-react";

import { storageService } from "../services/storage";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = storageService.getUser();

  const handleLogout = () => {
    storageService.logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Courses", path: "/courses", icon: BookOpen },
    { label: "My Learning", path: "/my-learning", icon: BookmarkCheck },
    { label: "Quizzes", path: "/quizzes", icon: CheckSquare },
    { label: "AI Recommendations", path: "/recommendations", icon: Sparkles },
    { label: "AI Doubt Solver", path: "/doubt-solver", icon: HelpCircle },
    { label: "AI Study Assistant", path: "/study-assistant", icon: Bot },
    { label: "Progress", path: "/progress", icon: TrendingUp },
    { label: "Profile", path: "/profile", icon: User }
  ];


  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 35
          }}
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="brand-icon" style={{ width: "32px", height: "32px" }}>
            <Brain size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="sidebar-brand-name">AI Adaptive</div>
            <div className="sidebar-brand-badge">EdTech Platform</div>
          </div>
          {isOpen && (
            <button
              onClick={onClose}
              style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <nav className="sidebar-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${isActive ? "active" : ""}`}
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="user-avatar-fallback">
              {user.name.charAt(0)}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div className="sidebar-user-name" title={user.name}>
                {user.name}
              </div>
              <div className="sidebar-user-sub" title={user.educationLevel}>
                {user.educationLevel.split("(")[0]}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{
              width: "100%",
              justifyContent: "flex-start",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#f87171",
              border: "1px solid rgba(248, 113, 113, 0.2)"
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
