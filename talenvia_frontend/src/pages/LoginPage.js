import React, { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { getEnvConfig } from "../config/env";
import { useAuth } from "../state/auth/AuthContext";

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login and sign-up page. */
  const { supabaseUrl, supabaseKey } = getEnvConfig();
  const { isAuthenticated, signInWithPassword, signUpWithPassword, signInWithOAuth } = useAuth();

  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("demo@talenvia.local");
  const [password, setPassword] = useState("password123");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const supabaseConfigured = useMemo(() => Boolean(supabaseUrl && supabaseKey), [supabaseUrl, supabaseKey]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "signin") await signInWithPassword({ email, password });
      else await signUpWithPassword({ email, password });
    } catch (err) {
      setError(err?.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 18 }}>
      <div className="cp-container" style={{ width: "min(680px, 100%)" }}>
        <div className="cp-card">
          <div className="modal-head" style={{ borderBottom: "1px solid var(--cp-border)" }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>Welcome to Talenvia</div>
              <div className="cp-muted" style={{ fontWeight: 700, fontSize: 12 }}>
                Sign in to start your Candy Pop career adventure
              </div>
            </div>
          </div>

          <div className="cp-card-pad">
            {!supabaseConfigured ? (
              <div className="banner" role="status" aria-live="polite">
                Supabase not configured. Login will use mock authentication.
                <div className="cp-muted" style={{ fontSize: 12, marginTop: 4 }}>
                  Set <code>REACT_APP_SUPABASE_URL</code> and <code>REACT_APP_SUPABASE_KEY</code>.
                </div>
              </div>
            ) : null}

            <div className="cp-spacer-12" />

            <div className="cp-row" role="tablist" aria-label="Auth mode">
              <button
                className={`cp-btn ${mode === "signin" ? "cp-btn-primary" : "cp-btn-ghost"}`}
                onClick={() => setMode("signin")}
                type="button"
              >
                Sign in
              </button>
              <button
                className={`cp-btn ${mode === "signup" ? "cp-btn-secondary" : "cp-btn-ghost"}`}
                onClick={() => setMode("signup")}
                type="button"
              >
                Sign up
              </button>
            </div>

            <div className="cp-spacer-12" />

            {error ? (
              <div
                className="cp-card-pad"
                style={{
                  border: "1px solid rgba(239,68,68,0.25)",
                  background: "rgba(239,68,68,0.10)",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 700,
                }}
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
              <label style={{ display: "block", fontWeight: 800, fontSize: 12 }}>
                Email
                <div className="cp-spacer-8" />
                <input
                  className="cp-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>

              <div className="cp-spacer-12" />

              <label style={{ display: "block", fontWeight: 800, fontSize: 12 }}>
                Password
                <div className="cp-spacer-8" />
                <input
                  className="cp-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                />
              </label>

              <div className="cp-spacer-16" />

              <button className="cp-btn cp-btn-primary" type="submit" disabled={busy}>
                {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            <div className="cp-spacer-16" />

            <div className="cp-muted" style={{ fontWeight: 800, fontSize: 12 }}>
              OAuth (placeholder)
            </div>
            <div className="cp-spacer-8" />

            <div className="cp-row">
              <button
                className="cp-btn cp-btn-ghost"
                type="button"
                onClick={() => signInWithOAuth("google")}
                disabled={!supabaseConfigured}
              >
                Continue with Google
              </button>
              <button
                className="cp-btn cp-btn-ghost"
                type="button"
                onClick={() => signInWithOAuth("github")}
                disabled={!supabaseConfigured}
              >
                Continue with GitHub
              </button>
            </div>

            <div className="cp-spacer-12" />
            <div className="cp-muted" style={{ fontSize: 12, fontWeight: 700 }}>
              Note: OAuth requires provider setup in Supabase. Buttons are disabled until Supabase env vars are set.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
