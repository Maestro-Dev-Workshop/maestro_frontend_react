import { Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage.jsx';
import SignUpPage from './features/auth/SignUpPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NewSessionPage from './features/session/NewSessionPage.jsx';
import TopicSelectionPage from './features/topic/TopicSelectionPage.jsx';
import ExercisePage from './features/topic/ExercisePage.jsx';
import ExamPage from './features/exam/ExamPage.jsx';
import ChatbotPage from './features/chatbot/ChatbotPage.jsx';
import ProfilePage from './features/profile/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import AppLayout from './layout/AppLayout.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';

export default function App() {
  return (
    <Routes>
    

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected Routes under AppLayout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="session/new" element={<NewSessionPage />} />
        <Route path="session/:sessionId/topics" element={<TopicSelectionPage />} />
        <Route path="topic/:topicId/exercises" element={<ExercisePage />} />
        <Route path="session/:sessionId/exam" element={<ExamPage />} />
        <Route path="session/:sessionId/chat" element={<ChatbotPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
// export default function App() {
//   return (
//     <div className="p-8">
//       <h1 className="text-3xl text-blue-600 font-bold underline">
//         Tailwind Is Working
//       </h1>
//       <p className="mt-2 text-gray-700">This is a direct test from App.jsx</p>
//     </div>
//   );
// }
