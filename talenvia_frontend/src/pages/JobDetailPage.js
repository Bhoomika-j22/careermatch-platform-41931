import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../services/apiClient";
import { getSavedJobIds, saveJob, unsaveJob } from "../state/savedJobs";

// PUBLIC_INTERFACE
export default function JobDetailPage() {
  /** Job details view for /jobs/:id */
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [saved, setSaved] = useState(() => getSavedJobIds().includes(id));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await apiRequest(`/jobs/${id}`);
        if (!mounted) return;
        setJob(res?.item || null);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load job");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  function toggleSave() {
    if (!id) return;
    if (saved) unsaveJob(id);
    else saveJob(id);
    setSaved(getSavedJobIds().includes(id));
  }

  return (
    <div className="cp-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Job details</h1>
          <div className="cp-muted" style={{ fontWeight: 600 }}>
            Get the scoop before you apply.
          </div>
        </div>
        <Link className="cp-btn cp-btn-ghost" to="/jobs">
          ← Back to jobs
        </Link>
      </div>

      <div className="cp-spacer-16" />

      {loading ? (
        <div className="cp-card cp-card-pad" role="status">
          Loading job…
        </div>
      ) : error ? (
        <div className="cp-card cp-card-pad" role="alert">
          <div style={{ fontWeight: 900 }}>Could not load job</div>
          <div className="cp-muted">{error}</div>
        </div>
      ) : !job ? (
        <div className="cp-card cp-card-pad">Not found.</div>
      ) : (
        <div className="cp-card cp-card-pad">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900 }}>{job.title}</div>
              <div className="cp-muted" style={{ fontWeight: 700 }}>
                {job.company} • {job.location}
              </div>
              <div className="cp-spacer-8" />
              <div className="cp-row" style={{ gap: 8 }}>
                {(job.tags || []).map((t) => (
                  <span key={t} className="cp-badge">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
              <span className="cp-badge">{job.salary}</span>
              <button
                className={`cp-btn ${saved ? "cp-btn-primary" : "cp-btn-ghost"}`}
                onClick={toggleSave}
                aria-pressed={saved}
              >
                {saved ? "Saved" : "Save"}
              </button>
            </div>
          </div>

          <div className="cp-spacer-16" />

          <div style={{ fontWeight: 900 }}>Description</div>
          <div className="cp-spacer-8" />
          <div style={{ lineHeight: 1.6 }}>{job.description}</div>

          <div className="cp-spacer-16" />

          <div className="banner" role="note">
            Apply flow is not implemented yet. Track your applications in the Applications module.
          </div>
        </div>
      )}
    </div>
  );
}
