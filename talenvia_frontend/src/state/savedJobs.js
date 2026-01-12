const KEY = "talenvia:savedJobs:v1";

function safeParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

// PUBLIC_INTERFACE
export function getSavedJobIds() {
  /** Returns list of saved job IDs from local storage. */
  const raw = localStorage.getItem(KEY);
  return safeParse(raw, []);
}

// PUBLIC_INTERFACE
export function isJobSaved(jobId) {
  /** Returns true if a job is saved locally. */
  return getSavedJobIds().includes(jobId);
}

// PUBLIC_INTERFACE
export function saveJob(jobId) {
  /** Saves a job ID locally. */
  const ids = new Set(getSavedJobIds());
  ids.add(jobId);
  localStorage.setItem(KEY, JSON.stringify(Array.from(ids)));
}

// PUBLIC_INTERFACE
export function unsaveJob(jobId) {
  /** Removes a saved job ID locally. */
  const ids = new Set(getSavedJobIds());
  ids.delete(jobId);
  localStorage.setItem(KEY, JSON.stringify(Array.from(ids)));
}
