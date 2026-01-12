import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../state/auth/AuthContext";

// PUBLIC_INTERFACE
export default function ProtectedRoute({ children }) {
  /** Guards routes behind auth; redirects to /login when not authenticated. */
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="cp-container" style={{ padding: 24 }}>
        <div className="cp-card cp-card-pad" role="status" aria-live="polite">
          Loading your sweet experience…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
