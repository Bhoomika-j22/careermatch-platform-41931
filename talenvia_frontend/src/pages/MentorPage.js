import React, { useEffect, useRef, useState } from "react";
import { apiRequest } from "../services/apiClient";

// PUBLIC_INTERFACE
export default function MentorPage() {
  /** AI Mentor chat UI (stubbed/mocked). */
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey! I’m your Talenvia mentor. What role are you targeting?" },
  ]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages, busy]);

  async function send() {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setText("");
    setBusy(true);

    try {
      // TODO: Replace with real backend endpoint when available.
      const res = await apiRequest("/mentor/message", {
        method: "POST",
        body: JSON.stringify({ text: trimmed }),
      });
      setMessages((m) => [...m, { role: "assistant", text: res?.reply || "…" }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: `I couldn't reach the mentor service. (${e?.message || "error"})` },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cp-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Mentor</h1>
          <div className="cp-muted" style={{ fontWeight: 600 }}>
            Ask questions, get guidance, and plan your next sweet move.
          </div>
        </div>
      </div>

      <div className="cp-spacer-16" />

      <div className="cp-card cp-card-pad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            maxHeight: 420,
            overflow: "auto",
            padding: 10,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--cp-border)",
            background: "rgba(255,255,255,0.6)",
          }}
          aria-label="Chat messages"
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  maxWidth: "78%",
                  padding: "10px 12px",
                  borderRadius: 16,
                  border: "1px solid var(--cp-border)",
                  background:
                    m.role === "user"
                      ? "rgba(167, 139, 250, 0.16)"
                      : "rgba(244, 114, 182, 0.12)",
                  fontWeight: 650,
                  lineHeight: 1.5,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {busy ? (
            <div className="cp-muted" style={{ fontWeight: 700 }}>
              Mentor is thinking…
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="cp-row" style={{ alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 360px" }}>
            <label style={{ display: "block", fontWeight: 800, fontSize: 12 }}>
              Your message
              <div className="cp-spacer-8" />
              <textarea
                className="cp-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="e.g., Help me tailor my resume for a React role…"
              />
            </label>
          </div>
          <button className="cp-btn cp-btn-primary" onClick={send} disabled={busy}>
            Send
          </button>
        </div>

        <div className="cp-muted" style={{ fontSize: 12, fontWeight: 700 }}>
          TODO: connect to backend AI mentor when available; currently uses feature-flagged mocks.
        </div>
      </div>
    </div>
  );
}
