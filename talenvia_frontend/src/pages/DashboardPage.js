import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/apiClient";
import { getSavedJobIds } from "../state/savedJobs";

// PUBLIC_INTERFACE
export default function DashboardPage() {
  /** Dashboard landing page. */
  const [counts, setCounts] = useState({ jobs: 0, saved: 0, applications: 0 });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          apiRequest("/jobs"),
          apiRequest("/applications"),
        ]);
        if (!mounted) return;

        const saved = getSavedJobIds().length;
        setCounts({
          jobs: jobsRes?.items?.length || 0,
          applications: appsRes?.items?.length || 0,
          saved,
        });
      } catch {
        if (!mounted) return;
        setCounts((c) => ({ ...c, saved: getSavedJobIds().length }));
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
          <h1 className="page-title">Dashboard</h1>
          <div className="cp-muted" style={{ fontWeight: 600 }}>
            Your candy-coated career progress at a glance.
          </div>
        </div>
      </div>

      <div className="cp-spacer-16" />

      <div className="cp-row">
        <div className="cp-card cp-card-pad" style={{ flex: "1 1 240px" }}>
          <div className="cp-muted" style={{ fontWeight: 800, fontSize: 12 }}>
            JOBS AVAILABLE
          </div>
          <div style={{ fontSize: 32, fontWeight: 900 }}>{counts.jobs}</div>
        </div>

        <div className="cp-card cp-card-pad" style={{ flex: "1 1 240px" }}>
          <div className="cp-muted" style={{ fontWeight: 800, fontSize: 12 }}>
            SAVED
          </div>
          <div style={{ fontSize: 32, fontWeight: 900 }}>{counts.saved}</div>
        </div>

        <div className="cp-card cp-card-pad" style={{ flex: "1 1 240px" }}>
          <div className="cp-muted" style={{ fontWeight: 800, fontSize: 12 }}>
            APPLICATIONS
          </div>
          <div style={{ fontSize: 32, fontWeight: 900 }}>{counts.applications}</div>
        </div>
      </div>

      <div className="cp-spacer-16" />

      <div className="cp-card cp-card-pad">
        <div style={{ fontWeight: 900 }}>Next sweet steps</div>
        <ul>
          <li>Browse jobs and save the ones that sparkle.</li>
          <li>Track your applications with a timeline.</li>
          <li>Practice with mock tests and earn badges.</li>
        </ul>
      </div>
    </div>
  );
}
