import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/apiClient";
import { getSavedJobIds, saveJob, unsaveJob } from "../state/savedJobs";

function matchesFilters(job, query, location) {
  const q = query.trim().toLowerCase();
  const loc = location.trim().toLowerCase();
  const hay = `${job.title} ${job.company} ${job.location} ${(job.tags || []).join(" ")}`.toLowerCase();

  if (q && !hay.includes(q)) return false;
  if (loc && !String(job.location || "").toLowerCase().includes(loc)) return false;
  return true;
}

// PUBLIC_INTERFACE
export default function JobsPage() {
  /** Job browse/search with filters. */
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [savedIds, setSavedIds] = useState(() => getSavedJobIds());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await apiRequest("/jobs");
        if (!mounted) return;
        setJobs(res?.items || []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load jobs");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((j) => matchesFilters(j, query, location));
  }, [jobs, query, location]);

  function toggleSave(jobId) {
    if (savedIds.includes(jobId)) {
      unsaveJob(jobId);
    } else {
      saveJob(jobId);
    }
    setSavedIds(getSavedJobIds());
  }

  return (
    <div className="cp-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Jobs</h1>
          <div className="cp-muted" style={{ fontWeight: 600 }}>
            Browse and save roles that make you pop.
          </div>
        </div>
      </div>

      <div className="cp-spacer-16" />

      <div className="cp-card cp-card-pad">
        <div className="cp-row">
          <div style={{ flex: "2 1 260px" }}>
            <label style={{ fontWeight: 800, fontSize: 12 }}>
              Search
              <div className="cp-spacer-8" />
              <input
                className="cp-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title, company, tags…"
              />
            </label>
          </div>

          <div style={{ flex: "1 1 200px" }}>
            <label style={{ fontWeight: 800, fontSize: 12 }}>
              Location
              <div className="cp-spacer-8" />
              <input
                className="cp-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Remote, NYC…"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="cp-spacer-16" />

      {loading ? (
        <div className="cp-card cp-card-pad" role="status" aria-live="polite">
          Loading jobs…
        </div>
      ) : error ? (
        <div className="cp-card cp-card-pad" role="alert">
          <div style={{ fontWeight: 900 }}>Could not load jobs</div>
          <div className="cp-muted">{error}</div>
        </div>
      ) : (
        <div className="cp-row" style={{ alignItems: "stretch" }}>
          {filtered.map((job) => {
            const saved = savedIds.includes(job.id);
            return (
              <div
                key={job.id}
                className="cp-card cp-card-pad"
                style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: 10 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 16 }}>{job.title}</div>
                    <div className="cp-muted" style={{ fontWeight: 700, fontSize: 12 }}>
                      {job.company} • {job.location}
                    </div>
                  </div>

                  <span className="cp-badge">{job.postedDaysAgo}d ago</span>
                </div>

                <div className="cp-row" style={{ gap: 8 }}>
                  {(job.tags || []).slice(0, 4).map((t) => (
                    <span key={t} className="cp-badge">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="cp-muted" style={{ fontWeight: 700 }}>
                  {job.salary}
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: "auto", flexWrap: "wrap" }}>
                  <Link className="cp-btn cp-btn-secondary" to={`/jobs/${job.id}`}>
                    View details
                  </Link>
                  <button
                    className={`cp-btn ${saved ? "cp-btn-primary" : "cp-btn-ghost"}`}
                    onClick={() => toggleSave(job.id)}
                    aria-pressed={saved}
                  >
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
