# Talenvia Frontend (React)

Talenvia is a Candy Pop themed job searching platform UI with modules for job browsing, saved jobs, application tracking, mock tests, challenges/badges, notifications, and an AI mentor chat UI.

This container is a CRA (Create React App) project and runs on port 3000 by default.

## Getting Started

```bash
npm install
npm start
```

Open: http://localhost:3000

## Routes

- `/login`
- `/dashboard`
- `/jobs`
- `/jobs/:id`
- `/saved`
- `/applications`
- `/mentor`
- `/tests`
- `/challenges`
- `/notifications`
- `/profile`

## Environment Variables

All configuration is environment-driven. When backend URLs are not configured, the UI automatically falls back to local mock data and shows a non-blocking banner in the sidebar.

Required (for real auth):
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_KEY`

Optional (for real backend APIs):
- `REACT_APP_API_BASE` (preferred) OR `REACT_APP_BACKEND_URL`

Optional (for real-time notifications):
- `REACT_APP_WS_URL`

Optional behavior toggles:
- `REACT_APP_FEATURE_FLAGS`
  - JSON: `{"useMocks": true}`
  - OR CSV: `useMocks=true,hideBackendBanner=true`
- `REACT_APP_EXPERIMENTS_ENABLED` (`true`/`false`)
- `REACT_APP_FRONTEND_URL` (used as Supabase `emailRedirectTo` during sign up)

## Feature Overview

- **App Shell**: Top navigation (brand + user menu), left sidebar for feature access, responsive layout.
- **Auth**: Supabase email/password auth. If Supabase env vars are missing, the app runs in **mock auth mode** so you can explore the UI.
- **Jobs**: Browse/search/filter jobs, view job details, save/unsave jobs (local storage).
- **Saved Jobs**: View saved jobs (local storage).
- **Applications**: Status + timeline tracker (mocked until backend exists).
- **AI Mentor**: Chat UI that calls a mock endpoint; TODO to connect a real mentor backend.
- **Mock Tests**: List tests and complete an attempt flow with mock questions.
- **Challenges & Badges**: Progress bars and badge display (mocked).
- **Notifications**: Panel with WebSocket placeholder and env-driven WS URL; uses mock list by default.

## Notes

- This project intentionally avoids heavy UI frameworks; styling is implemented with vanilla CSS using the Candy Pop theme tokens.
- For production auth + OAuth, configure providers in Supabase and set redirect URLs appropriately.
