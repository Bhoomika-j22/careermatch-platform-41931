import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import SavedJobsPage from "./pages/SavedJobsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import MentorPage from "./pages/MentorPage";
import TestsPage from "./pages/TestsPage";
import ChallengesPage from "./pages/ChallengesPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";

// PUBLIC_INTERFACE
function App() {
  /** Root app component providing all routes. */
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected app area inside the shell */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/:id" element={<JobDetailPage />} />
        <Route path="saved" element={<SavedJobsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="mentor" element={<MentorPage />} />
        <Route path="tests" element={<TestsPage />} />
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
