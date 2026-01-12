import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/apiClient";
import { getSavedJobIds, unsaveJob } from "../state/savedJobs";

// PUBLIC_INTERFACE
export default function SavedJobsPage() {
  /** Saved jobs page. */
  const [jobs, setJobs] = useState([]);
  const [savedIds, setSavedIds] = useState(() => getSavedJobIds());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const ids = getSavedJobIds();
      setSavedIds(ids);

      try {
        const res = await apiRequest("/jobs");
        if (!mounted) return;
        setJobs(res?.items || []);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const savedJobs = useMemo(() => {
    const map = new Map(jobs.map((j) => [j.id, j]));
    return savedIds.map((id) => map.get(id)).filter(Boolean);
  }, [jobs, savedIds]);

  function remove(id) {
    unsaveJob(id);
    setSavedIds(getSavedJobIds());
  }

  return (
    <div className="cp-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Saved jobs</h1>
          <div className="cp-muted" style={{ fontWeight: 600 }}>
            Your favorites, ready to revisit.
          </div>
        </div>
      </div>

      <div className="cp-spacer-16" />

      {loading ? (
        <div className="cp-card cp-card-pad" role="status">
          Loading…
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="cp-card cp-card-pad">
          <div style={{ fontWeight: 900 }}>No saved jobs yet</div>
          <div className="cp-muted">Go to Jobs and tap Save on roles you like.</div>
          <div className="cp-spacer-12" />
          <Link className="cp-btn cp-btn-secondary" to="/jobs">
            Browse jobs
          </Link>
        </div>
      ) : (
        <div className="cp-row">
          {savedJobs.map((job) => (
            <div key={job.id} className="cp-card cp-card-pad" style={{ flex: "1 1 320px" }}>
              <div style={{ fontWeight: 900 }}>{job.title}</div>
              <div className="cp-muted" style={{ fontWeight: 700, fontSize: 12 }}>
                {job.company} • {job.location}
              </div>
              <div className="cp-spacer-12" />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link className="cp-btn cp-btn-primary" to={`/jobs/${job.id}`}>
                  View
                </Link>
                <button className="cp-btn cp-btn-ghost" onClick={() => remove(job.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
