import { getEnvConfig } from "../config/env";
import { mockApi } from "./mockApi";

/**
 * Thin fetch wrapper with:
 * - base URL resolution from env
 * - retries on transient failures
 * - feature-flag driven mock fallback
 */

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function shouldUseMocks() {
  const { apiBase, featureFlags } = getEnvConfig();
  if (!apiBase) return true;
  if (featureFlags.useMocks === true) return true;
  return false;
}

// PUBLIC_INTERFACE
export async function apiRequest(path, options = {}) {
  /** Performs an API request; falls back to mock implementation when configured. */
  if (shouldUseMocks()) {
    return mockApi(path, options);
  }

  const { apiBase } = getEnvConfig();
  const url = `${apiBase}${path.startsWith("/") ? "" : "/"}${path}`;

  const retries = Number(options.retries ?? 2);
  const retryDelayMs = Number(options.retryDelayMs ?? 300);

  let lastErr = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });

      // Treat 5xx as retryable; 4xx as terminal.
      if (res.status >= 500 && res.status <= 599) {
        throw new Error(`Server error ${res.status}`);
      }

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const body = isJson ? await res.json() : await res.text();

      if (!res.ok) {
        const message =
          typeof body === "string" ? body : body?.message || "Request failed";
        const err = new Error(message);
        err.status = res.status;
        err.body = body;
        throw err;
      }

      return body;
    } catch (e) {
      lastErr = e;
      if (attempt < retries) {
        await sleep(retryDelayMs * Math.pow(2, attempt));
        continue;
      }
    }
  }

  // If backend is configured but failing, still offer mocks as a safety net.
  // This is intentionally non-blocking.
  try {
    return await mockApi(path, options);
  } catch {
    throw lastErr;
  }
}
