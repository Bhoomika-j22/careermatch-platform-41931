import {
  mockApplications,
  mockChallenges,
  mockJobs,
  mockNotifications,
  mockTests,
  mockTestQuestions,
} from "./mockData";

function jsonResponse(data) {
  // Mimic typical JSON API response shapes while keeping it flexible.
  return Promise.resolve(data);
}

function parseBody(options) {
  if (!options) return null;
  if (options.body == null) return null;
  try {
    return typeof options.body === "string" ? JSON.parse(options.body) : options.body;
  } catch {
    return options.body;
  }
}

// PUBLIC_INTERFACE
export async function mockApi(path, options = {}) {
  /** Mock API handler used when backend isn't configured or feature flags enable mocks. */
  const method = (options.method || "GET").toUpperCase();
  const body = parseBody(options);

  // Jobs
  if (path === "/jobs" && method === "GET") {
    return jsonResponse({ items: mockJobs });
  }
  if (path.startsWith("/jobs/") && method === "GET") {
    const id = path.split("/")[2];
    const job = mockJobs.find((j) => j.id === id);
    if (!job) throw new Error("Job not found (mock)");
    return jsonResponse({ item: job });
  }

  // Saved jobs (local only typically; but mock supports a server-style endpoint)
  if (path === "/saved" && method === "GET") {
    return jsonResponse({ items: [] });
  }
  if (path === "/saved" && method === "POST") {
    return jsonResponse({ ok: true, savedJobId: body?.jobId || null });
  }

  // Applications
  if (path === "/applications" && method === "GET") {
    return jsonResponse({ items: mockApplications });
  }

  // Mentor
  if (path === "/mentor/message" && method === "POST") {
    const text = String(body?.text || "");
    return jsonResponse({
      reply:
        text.trim().length === 0
          ? "Ask me anything about your next career step."
          : `Mock mentor reply: I hear you! Let's turn "${text}" into an action plan.`,
    });
  }

  // Tests
  if (path === "/tests" && method === "GET") {
    return jsonResponse({ items: mockTests });
  }
  if (path.startsWith("/tests/") && path.endsWith("/questions") && method === "GET") {
    const parts = path.split("/");
    const testId = parts[2];
    const questions = mockTestQuestions[testId] || [];
    return jsonResponse({ items: questions });
  }

  // Challenges
  if (path === "/challenges" && method === "GET") {
    return jsonResponse({ items: mockChallenges });
  }

  // Notifications
  if (path === "/notifications" && method === "GET") {
    return jsonResponse({ items: mockNotifications });
  }

  // Default
  return jsonResponse({ ok: true, mocked: true, path, method });
}
