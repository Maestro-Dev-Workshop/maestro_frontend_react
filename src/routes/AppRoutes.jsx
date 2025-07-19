import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import LoginPage from '../features/auth/LoginPage';
import SignupPage from '../features/auth/SignupPage';

// Protected pages
import DashboardPage from '../features/dashboard/DashboardPage';
import LessonPage from '../features/lesson/LessonPage';
import Step1SubjectMaterials from '../features/session-creation/Step1SubjectMaterials';
import Step2LessonGeneration from '../features/session-creation/Step2LessonGeneration';
import Step3QuestionGeneration from '../features/session-creation/Step3QuestionGeneration';

// Common
import ProtectedRoute from '../features/common/ProtectedRoute';
import MainLayout from '../layout/MainLayout';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />

            {/* Session Creation */}
            <Route path="/session/create/step-1" element={<Step1SubjectMaterials />} />
            <Route path="/session/create/step-2/:sessionId" element={<Step2LessonGeneration />} />
            <Route path="/session/create/step-3/:sessionId" element={<Step3QuestionGeneration />} />

            {/* Lesson */}
            <Route path="/session/:sessionId/lesson/*" element={<LessonPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
