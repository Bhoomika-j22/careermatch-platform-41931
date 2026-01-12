import React from "react";
import { getEnvConfig } from "../config/env";
import { useAuth } from "../state/auth/AuthContext";

// PUBLIC_INTERFACE
export default function ProfilePage() {
  /** User profile page (minimal placeholder). */
  const { user, session } = useAuth();
  const { experimentsEnabled } = getEnvConfig();

  return (
    <div className="cp-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <div className="cp-muted" style={{ fontWeight: 600 }}>
            Keep your sparkle settings tidy.
          </div>
        </div>
      </div>

      <div className="cp-spacer-16" />

      <div className="cp-card cp-card-pad">
        <div style={{ fontWeight: 900 }}>Account</div>
        <div className="cp-spacer-8" />
        <div className="cp-muted" style={{ fontWeight: 700 }}>
          Email: <span style={{ color: "var(--cp-text)" }}>{user?.email || "—"}</span>
        </div>
        <div className="cp-spacer-8" />
        <div className="cp-muted" style={{ fontWeight: 700 }}>
          Auth mode:{" "}
          <span style={{ color: "var(--cp-text)" }}>
            {session?.mock ? "Mock" : "Supabase"}
          </span>
        </div>
        <div className="cp-spacer-12" />
        <div className="cp-badge">{experimentsEnabled ? "Experiments enabled" : "Experiments off"}</div>
      </div>

      <div className="cp-spacer-16" />

      <div className="cp-card cp-card-pad">
        <div style={{ fontWeight: 900 }}>Coming soon</div>
        <ul>
          <li>Skill-based profile</li>
          <li>Resume upload</li>
          <li>Job match preferences</li>
        </ul>
      </div>
    </div>
  );
}
