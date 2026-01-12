import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "../../services/supabaseClient";

const AuthContext = createContext(null);

function getMockUser() {
  return { id: "mock-user", email: "demo@talenvia.local" };
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and actions. */
  const supabase = getSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let unsub = null;

    async function init() {
      if (!supabase) {
        // Mock auth mode: treat as signed-in so the app can be explored.
        setSession({ user: getMockUser(), mock: true });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (!error) setSession(data?.session || null);

      const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession || null);
      });
      unsub = listener?.subscription;

      setLoading(false);
    }

    init();

    return () => {
      try {
        unsub?.unsubscribe?.();
      } catch {
        // ignore
      }
    };
  }, [supabase]);

  const value = useMemo(() => {
    return {
      loading,
      session,
      user: session?.user || null,
      isAuthenticated: Boolean(session?.user),

      // PUBLIC_INTERFACE
      async signInWithPassword({ email, password }) {
        /** Sign in with email/password; uses mock auth if Supabase not configured. */
        if (!supabase) {
          setSession({ user: { id: "mock-user", email }, mock: true });
          return { ok: true, mocked: true };
        }
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSession(data.session || null);
        return { ok: true };
      },

      // PUBLIC_INTERFACE
      async signUpWithPassword({ email, password }) {
        /** Sign up with email/password. NOTE: Email redirect should be set via REACT_APP_FRONTEND_URL. */
        if (!supabase) {
          setSession({ user: { id: "mock-user", email }, mock: true });
          return { ok: true, mocked: true };
        }

        // IMPORTANT: ensure the redirect URL is environment-driven.
        // Request from user / orchestrator if not present:
        // REACT_APP_FRONTEND_URL should be set to deployed site URL.
        const emailRedirectTo = (process.env.REACT_APP_FRONTEND_URL || "").trim() || undefined;

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: emailRedirectTo ? { emailRedirectTo } : undefined,
        });
        if (error) throw error;

        // Session may be null depending on Supabase settings (email confirmation).
        setSession(data.session || null);
        return { ok: true };
      },

      // PUBLIC_INTERFACE
      async signInWithOAuth(provider) {
        /** OAuth placeholder; requires Supabase OAuth provider configuration. */
        if (!supabase) return { ok: true, mocked: true };
        // TODO: Configure provider in Supabase and enable redirect URL.
        const { error } = await supabase.auth.signInWithOAuth({ provider });
        if (error) throw error;
        return { ok: true };
      },

      // PUBLIC_INTERFACE
      async signOut() {
        /** Signs out. */
        if (!supabase) {
          setSession(null);
          return { ok: true, mocked: true };
        }
        await supabase.auth.signOut();
        setSession(null);
        return { ok: true };
      },
    };
  }, [loading, session, supabase]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state/actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
