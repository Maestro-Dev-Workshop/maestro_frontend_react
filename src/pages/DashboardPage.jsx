import { useEffect, useState } from 'react';
import { getUserSessions } from '../services/sessionService.js';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await getUserSessions();
        setSessions(res.data.sessions);
        console.log('session list response:', res.data);
      } catch (err) {
        alert('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">My Sessions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((s) => (
            <li key={s.id} className="p-4 bg-white rounded shadow">
              <h2 className="font-semibold">{s.name}</h2>
              <p className="text-sm text-gray-500">
                Created: {new Date(s.created_at).toLocaleString()}
              </p>
              <div className="mt-2 space-x-2">
                <Link
                  to={`/session/${s.id}/topics`}
                  className="text-blue-600 underline"
                >
                  Topics
                </Link>
                <Link
                  to={`/session/${s.id}/exam`}
                  className="text-green-600 underline"
                >
                  Exam
                </Link>
                <Link
                  to={`/session/${s.id}/chat`}
                  className="text-purple-600 underline"
                >
                  Chat
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
