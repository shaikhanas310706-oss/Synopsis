import React from "react";

export function DashboardCard({ title, value, subtitle, icon: Icon, badge, color = "var(--primary)" }) {
  return (
    <div className="card card-hover" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.025em" }}>
          {title}
        </div>
        {Icon && (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-md)",
              backgroundColor: `${color}15`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)" }}>
          {value}
        </span>
        {badge && (
          <span className="badge badge-primary" style={{ fontSize: "0.72rem" }}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function ProgressBar({ value = 0, max = 100, label, showPercentage = true, color = "var(--primary)" }) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className="progress-container">
      {(label || showPercentage) && (
        <div className="progress-header">
          {label && <span>{label}</span>}
          {showPercentage && <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{percentage}%</span>}
        </div>
      )}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}
