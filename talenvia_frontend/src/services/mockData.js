export const mockJobs = [
  {
    id: "job_101",
    title: "Frontend Engineer (React)",
    company: "CandyCloud",
    location: "Remote",
    tags: ["React", "Accessibility", "CSS"],
    salary: "$90k–$120k",
    postedDaysAgo: 2,
    description:
      "Build playful UI experiences. Focus on accessibility, component systems, and performance.",
  },
  {
    id: "job_102",
    title: "Junior Full‑Stack Developer",
    company: "SprinkleWorks",
    location: "New York, NY",
    tags: ["Node.js", "PostgreSQL", "Testing"],
    salary: "$75k–$95k",
    postedDaysAgo: 6,
    description:
      "Work across frontend and backend. Learn fast, ship often, and keep things sweet.",
  },
  {
    id: "job_103",
    title: "UI Engineer (Design Systems)",
    company: "PopPalette",
    location: "San Francisco, CA",
    tags: ["Design Systems", "Tokens", "TypeScript"],
    salary: "$110k–$145k",
    postedDaysAgo: 1,
    description:
      "Evolve our design tokens and component library. Collaborate closely with product design.",
  },
];

export const mockApplications = [
  {
    id: "app_201",
    jobId: "job_101",
    jobTitle: "Frontend Engineer (React)",
    company: "CandyCloud",
    status: "Interview",
    updatedAt: "2026-01-05",
    timeline: [
      { at: "2025-12-28", label: "Applied" },
      { at: "2026-01-02", label: "Recruiter screen" },
      { at: "2026-01-05", label: "Interview scheduled" },
    ],
  },
  {
    id: "app_202",
    jobId: "job_102",
    jobTitle: "Junior Full‑Stack Developer",
    company: "SprinkleWorks",
    status: "Applied",
    updatedAt: "2026-01-03",
    timeline: [{ at: "2026-01-03", label: "Applied" }],
  },
];

export const mockTests = [
  {
    id: "test_301",
    title: "React Fundamentals",
    durationMinutes: 20,
    questionCount: 5,
  },
  {
    id: "test_302",
    title: "JavaScript Essentials",
    durationMinutes: 15,
    questionCount: 5,
  },
];

export const mockTestQuestions = {
  test_301: [
    {
      id: "q1",
      prompt: "Which hook is typically used for side effects?",
      choices: ["useMemo", "useEffect", "useRef", "useId"],
      answerIndex: 1,
    },
    {
      id: "q2",
      prompt: "What prop is required when rendering lists?",
      choices: ["id", "name", "key", "index"],
      answerIndex: 2,
    },
    {
      id: "q3",
      prompt: "What is a controlled input?",
      choices: [
        "Input that uses refs",
        "Input whose value is driven by state",
        "Input that is readonly",
        "Input with validation",
      ],
      answerIndex: 1,
    },
    {
      id: "q4",
      prompt: "Best place to fetch data for a page in SPA?",
      choices: ["render()", "useEffect()", "useMemo()", "useCallback()"],
      answerIndex: 1,
    },
    {
      id: "q5",
      prompt: "What improves accessibility for icons-only buttons?",
      choices: ["role='button'", "aria-label", "tabIndex='-1'", "data-testid"],
      answerIndex: 1,
    },
  ],
  test_302: [
    {
      id: "q1",
      prompt: "What does Array.prototype.map return?",
      choices: ["A number", "A new array", "The same array", "Nothing"],
      answerIndex: 1,
    },
    {
      id: "q2",
      prompt: "Which is NOT a primitive?",
      choices: ["string", "number", "object", "boolean"],
      answerIndex: 2,
    },
    {
      id: "q3",
      prompt: "What does === check?",
      choices: ["Value only", "Type only", "Value and type", "Neither"],
      answerIndex: 2,
    },
    {
      id: "q4",
      prompt: "Promise states include:",
      choices: ["pending/fulfilled/rejected", "open/closed", "cold/hot", "up/down"],
      answerIndex: 0,
    },
    {
      id: "q5",
      prompt: "Which creates a block scope?",
      choices: ["var", "let", "function", "this"],
      answerIndex: 1,
    },
  ],
};

export const mockChallenges = [
  {
    id: "ch_401",
    title: "Apply to 3 jobs",
    progress: 1,
    target: 3,
    badge: { id: "b1", name: "Sprout Starter", color: "success" },
  },
  {
    id: "ch_402",
    title: "Complete 1 mock test",
    progress: 0,
    target: 1,
    badge: { id: "b2", name: "Quiz Whiz", color: "warn" },
  },
];

export const mockNotifications = [
  {
    id: "n1",
    title: "Interview tip",
    body: "Try the STAR method: Situation, Task, Action, Result.",
    at: "2026-01-09 10:20",
    unread: true,
  },
  {
    id: "n2",
    title: "New jobs match",
    body: "3 new roles match your profile: React + Accessibility.",
    at: "2026-01-08 17:05",
    unread: false,
  },
];
