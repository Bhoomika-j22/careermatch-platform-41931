import React, { useEffect, useMemo, useState } from "react";
import { getEnvConfig } from "../config/env";
import { apiRequest } from "../services/apiClient";

// PUBLIC_INTERFACE
export default function NotificationsPage() {
  /** Notifications panel with WebSocket placeholder using REACT_APP_WS_URL. */
  const { wsUrl } = getEnvConfig();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const wsConfigured = useMemo(() => Boolean(wsUrl), [wsUrl]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await apiRequest("/notifications");
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
          <h1 className="page-title">Notifications</h1>
          <div className="cp-muted" style={{ fontWeight: 600 }}>
            Stay in the loop (sprinkles included).
          </div>
        </div>
      </div>

      <div className="cp-spacer-16" />

      <div className="cp-card cp-card-pad">
        <div style={{ fontWeight: 900 }}>Real-time updates</div>
        <div className="cp-spacer-8" />
        {wsConfigured ? (
          <div className="cp-muted" style={{ fontWeight: 700 }}>
            WebSocket URL configured: <code>{wsUrl}</code>
            <div className="cp-spacer-8" />
            TODO: Implement WebSocket client to receive live notifications.
          </div>
        ) : (
          <div className="cp-muted" style={{ fontWeight: 700 }}>
            WebSocket not configured. Set <code>REACT_APP_WS_URL</code> to enable real-time updates.
          </div>
        )}
      </div>

      <div className="cp-spacer-16" />

      {loading ? (
        <div className="cp-card cp-card-pad" role="status">
          Loading notifications…
        </div>
      ) : items.length === 0 ? (
        <div className="cp-card cp-card-pad">No notifications.</div>
      ) : (
        <div className="cp-row">
          {items.map((n) => (
            <div key={n.id} className="cp-card cp-card-pad" style={{ flex: "1 1 360px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 900 }}>{n.title}</div>
                {n.unread ? <span className="cp-badge cp-badge-warn">Unread</span> : <span className="cp-badge">Read</span>}
              </div>
              <div className="cp-spacer-8" />
              <div style={{ lineHeight: 1.6 }}>{n.body}</div>
              <div className="cp-spacer-8" />
              <div className="cp-muted" style={{ fontWeight: 700, fontSize: 12 }}>
                {n.at}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
