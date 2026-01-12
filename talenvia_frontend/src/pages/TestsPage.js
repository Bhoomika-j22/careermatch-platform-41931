import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../services/apiClient";

function grade(questions, answers) {
  let correct = 0;
  questions.forEach((q) => {
    if (answers[q.id] === q.answerIndex) correct += 1;
  });
  return { correct, total: questions.length };
}

// PUBLIC_INTERFACE
export default function TestsPage() {
  /** Mock tests: list, attempt flow with mock questions. */
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [stage, setStage] = useState("list"); // list | attempt | results
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await apiRequest("/tests");
        if (!mounted) return;
        setTests(res?.items || []);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function start(test) {
    setActiveTest(test);
    setStage("attempt");
    setAnswers({});
    const res = await apiRequest(`/tests/${test.id}/questions`);
    setQuestions(res?.items || []);
  }

  const results = useMemo(() => {
    if (stage !== "results") return null;
    return grade(questions, answers);
  }, [answers, questions, stage]);

  if (loading) {
    return (
      <div className="cp-container">
        <div className="cp-card cp-card-pad" role="status">
          Loading tests…
        </div>
      </div>
    );
  }

  return (
    <div className="cp-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mock Tests</h1>
          <div className="cp-muted" style={{ fontWeight: 600 }}>
            Practice, learn, repeat.
          </div>
        </div>
        {stage !== "list" ? (
          <button className="cp-btn cp-btn-ghost" onClick={() => setStage("list")}>
            ← Back to list
          </button>
        ) : null}
      </div>

      <div className="cp-spacer-16" />

      {stage === "list" ? (
        <div className="cp-row">
          {tests.map((t) => (
            <div key={t.id} className="cp-card cp-card-pad" style={{ flex: "1 1 320px" }}>
              <div style={{ fontWeight: 900 }}>{t.title}</div>
              <div className="cp-muted" style={{ fontWeight: 700, fontSize: 12 }}>
                {t.questionCount} questions • {t.durationMinutes} minutes
              </div>
              <div className="cp-spacer-12" />
              <button className="cp-btn cp-btn-primary" onClick={() => start(t)}>
                Start
              </button>
            </div>
          ))}
        </div>
      ) : stage === "attempt" ? (
        <div className="cp-card cp-card-pad">
          <div style={{ fontWeight: 900, fontSize: 16 }}>
            {activeTest?.title || "Test"}
          </div>
          <div className="cp-muted" style={{ fontWeight: 700 }}>
            Pick one answer per question.
          </div>

          <div className="cp-spacer-16" />

          <ol style={{ margin: 0, paddingLeft: 18 }}>
            {questions.map((q) => (
              <li key={q.id} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 900 }}>{q.prompt}</div>
                <div className="cp-spacer-8" />
                <div role="radiogroup" aria-label={`Answers for ${q.prompt}`}>
                  {(q.choices || []).map((c, idx) => (
                    <label
                      key={idx}
                      style={{
                        display: "block",
                        padding: "8px 10px",
                        borderRadius: 12,
                        border: "1px solid var(--cp-border)",
                        marginBottom: 8,
                        background:
                          answers[q.id] === idx
                            ? "rgba(244, 114, 182, 0.12)"
                            : "rgba(255,255,255,0.65)",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers[q.id] === idx}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                        style={{ marginRight: 8 }}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ol>

          <button className="cp-btn cp-btn-secondary" onClick={() => setStage("results")}>
            Submit
          </button>
        </div>
      ) : (
        <div className="cp-card cp-card-pad">
          <div style={{ fontWeight: 900, fontSize: 18 }}>Results</div>
          <div className="cp-spacer-8" />
          <div className="cp-badge cp-badge-success">
            Score: {results?.correct ?? 0}/{results?.total ?? 0}
          </div>

          <div className="cp-spacer-16" />

          <button className="cp-btn cp-btn-primary" onClick={() => setStage("list")}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}
