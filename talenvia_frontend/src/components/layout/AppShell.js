import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getEnvConfig } from "../../config/env";
import { useAuth } from "../../state/auth/AuthContext";
import Modal from "../ui/Modal";

function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

// PUBLIC_INTERFACE
export default function AppShell() {
  /** App shell layout with top navigation, sidebar, and main content outlet. */
  const { apiBase, featureFlags } = getEnvConfig();
  const { user, signOut, session } = useAuth();
  const navigate = useNavigate();
  const [aboutOpen, setAboutOpen] = useState(false);

  const showBackendBanner = useMemo(() => {
    if (featureFlags.hideBackendBanner === true) return false;
    // Show when backend is not configured (mock mode).
    return !apiBase;
  }, [apiBase, featureFlags.hideBackendBanner]);

  async function onSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <header className="topbar" role="banner">
        <div className="brand">
          <div className="brand-bubble" aria-hidden="true" />
          <div>
            <div className="brand-title">Talenvia</div>
            <div className="cp-muted" style={{ fontSize: 12, fontWeight: 700 }}>
              Candy Pop Career Hub
            </div>
          </div>
        </div>

        <div className="user-menu">
          <button className="cp-btn cp-btn-ghost" onClick={() => setAboutOpen(true)}>
            About
          </button>

          <div className="user-pill" aria-label="User menu">
            <span aria-hidden="true">👤</span>
            <span style={{ fontWeight: 800, fontSize: 13 }}>
              {user?.email || "Signed in"}
            </span>
            {session?.mock ? <span className="cp-badge">Mock auth</span> : null}
          </div>

          <button className="cp-btn cp-btn-primary" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <div className="shell-body">
        <aside className="sidebar" role="navigation" aria-label="Primary">
          <nav className="sidebar-nav">
            <NavItem to="/dashboard" label="Dashboard" icon="🏠" />
            <NavItem to="/jobs" label="Jobs" icon="🔎" />
            <NavItem to="/saved" label="Saved" icon="💖" />
            <NavItem to="/applications" label="Applications" icon="🗂️" />
            <NavItem to="/mentor" label="AI Mentor" icon="🤖" />
            <NavItem to="/tests" label="Mock Tests" icon="🧠" />
            <NavItem to="/challenges" label="Challenges" icon="🏅" />
            <NavItem to="/notifications" label="Notifications" icon="🔔" />
            <NavItem to="/profile" label="Profile" icon="✨" />
          </nav>

          <div className="cp-spacer-16" />

          {showBackendBanner ? (
            <div className="banner" role="status" aria-live="polite">
              Backend not connected. Using local mock data.
              <div className="cp-muted" style={{ fontSize: 12, marginTop: 4 }}>
                Set <code>REACT_APP_API_BASE</code> (or <code>REACT_APP_BACKEND_URL</code>) to
                connect APIs.
              </div>
            </div>
          ) : null}
        </aside>

        <main className="main" role="main">
          <Outlet />
        </main>
      </div>

      {aboutOpen ? (
        <Modal title="About Talenvia" onClose={() => setAboutOpen(false)}>
          <p style={{ marginTop: 0 }}>
            Talenvia is a playful job search platform with AI mentor, mock tests, challenges,
            application tracking, and notifications.
          </p>
          <p className="cp-muted" style={{ marginBottom: 0 }}>
            Tip: Configure Supabase and backend env vars to enable real auth and live data.
          </p>
        </Modal>
      ) : null}
    </div>
  );
}
