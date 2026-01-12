import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/apiClient";

function clamp01(v) {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

// PUBLIC_INTERFACE
export default function ChallengesPage() {
  /** Challenges list with progress and badge display. */
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await apiRequest("/challenges");
        if (!mounted) return;
        setItems(res?.items || []);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="cp-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Challenges</h1>
          <div className="cp-muted" style={{ fontWeight: 600 }}>
            Level up with tiny wins.
          </div>
        </div>
      </div>

      <div className="cp-spacer-16" />

      {loading ? (
        <div className="cp-card cp-card-pad" role="status">
          Loading challenges…
        </div>
      ) : (
        <div className="cp-row">
          {items.map((c) => {
            const progress = clamp01((c.progress || 0) / (c.target || 1));
            return (
              <div key={c.id} className="cp-card cp-card-pad" style={{ flex: "1 1 340px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 900 }}>{c.title}</div>
                  <span className={`cp-badge ${c.badge?.color === "success" ? "cp-badge-success" : "cp-badge-warn"}`}>
                    🏅 {c.badge?.name || "Badge"}
                  </span>
                </div>

                <div className="cp-spacer-12" />

                <div className="cp-muted" style={{ fontWeight: 800 }}>
                  {c.progress}/{c.target} completed
                </div>

                <div className="cp-spacer-8" />

                <div
                  style={{
                    height: 12,
                    borderRadius: 999,
                    background: "rgba(55, 65, 81, 0.08)",
                    border: "1px solid var(--cp-border)",
                    overflow: "hidden",
                  }}
                  aria-label={`Progress ${Math.round(progress * 100)}%`}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.round(progress * 100)}%`,
                      background: "var(--cp-gradient)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
