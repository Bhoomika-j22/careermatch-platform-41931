import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/apiClient";

function statusBadgeClass(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("offer") || s.includes("hired")) return "cp-badge-success";
  if (s.includes("interview")) return "cp-badge-warn";
  return "";
}

// PUBLIC_INTERFACE
export default function ApplicationsPage() {
  /** Application tracker with timeline. */
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await apiRequest("/applications");
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
          <h1 className="page-title">Applications</h1>
          <div className="cp-muted" style={{ fontWeight: 600 }}>
            Track statuses and keep momentum.
          </div>
        </div>
      </div>

      <div className="cp-spacer-16" />

      {loading ? (
        <div className="cp-card cp-card-pad" role="status">
          Loading applications…
        </div>
      ) : items.length === 0 ? (
        <div className="cp-card cp-card-pad">No applications yet.</div>
      ) : (
        <div className="cp-row">
          {items.map((app) => {
            const isOpen = openId === app.id;
            return (
              <div key={app.id} className="cp-card cp-card-pad" style={{ flex: "1 1 380px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{app.jobTitle}</div>
                    <div className="cp-muted" style={{ fontWeight: 700, fontSize: 12 }}>
                      {app.company} • Updated {app.updatedAt}
                    </div>
                  </div>
                  <span className={`cp-badge ${statusBadgeClass(app.status)}`}>{app.status}</span>
                </div>

                <div className="cp-spacer-12" />

                <button
                  className="cp-btn cp-btn-ghost"
                  onClick={() => setOpenId(isOpen ? null : app.id)}
                  aria-expanded={isOpen}
                >
                  {isOpen ? "Hide timeline" : "View timeline"}
                </button>

                {isOpen ? (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 900 }}>Timeline</div>
                    <div className="cp-spacer-8" />
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {(app.timeline || []).map((t) => (
                        <li key={`${app.id}-${t.at}`}>
                          <span style={{ fontWeight: 800 }}>{t.at}:</span> {t.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
