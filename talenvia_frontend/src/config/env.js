/**
 * Centralized environment handling.
 * IMPORTANT: Do not hardcode secrets. Values come from CRA env vars (REACT_APP_*).
 */

// PUBLIC_INTERFACE
export function getEnvConfig() {
  /** Returns normalized env configuration and feature flags. */
  const apiBase =
    (process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "")
      .trim()
      .replace(/\/+$/, "");

  const wsUrl = (process.env.REACT_APP_WS_URL || "").trim();
  const experimentsEnabled =
    String(process.env.REACT_APP_EXPERIMENTS_ENABLED || "")
      .trim()
      .toLowerCase() === "true";

  const featureFlagsRaw = (process.env.REACT_APP_FEATURE_FLAGS || "").trim();
  const featureFlags = parseFeatureFlags(featureFlagsRaw);

  const supabaseUrl = (process.env.REACT_APP_SUPABASE_URL || "").trim();
  const supabaseKey = (process.env.REACT_APP_SUPABASE_KEY || "").trim();

  return {
    apiBase,
    wsUrl,
    experimentsEnabled,
    featureFlags,
    supabaseUrl,
    supabaseKey,
  };
}

function parseFeatureFlags(raw) {
  // Supports:
  // - JSON: {"useMocks": true}
  // - CSV: useMocks=true,mentorMocks=true
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    // ignore
  }

  const out = {};
  raw.split(",").forEach((pair) => {
    const [k, v] = pair.split("=").map((s) => (s || "").trim());
    if (!k) return;
    if (!v) {
      out[k] = true;
      return;
    }
    const lower = v.toLowerCase();
    if (lower === "true") out[k] = true;
    else if (lower === "false") out[k] = false;
    else out[k] = v;
  });
  return out;
}
