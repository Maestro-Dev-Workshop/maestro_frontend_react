// src/features/dashboard/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { getSessions } from './dashboardService';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const data = await getSessions();
            setSessions(data.sessions || []);
        } catch (err) {
            alert('Error fetching sessions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleStartSessionCreation = () => {
        navigate('/session/create/step-1');
    };

    const handleSessionClick = (session) => {
        navigate(`/session/${session.id}/lesson`);
    };

    if (loading) return <p>Loading sessions...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>

            <button onClick={handleStartSessionCreation} style={{ marginBottom: '20px' }}>
                Create New Session
            </button>

            <h2>Your Sessions</h2>
            {sessions.length === 0 ? (
                <p>No sessions yet. Click "Create New Session" to start.</p>
            ) : (
                <ul>
                    {sessions.map((session) => (
                        <li key={session.id} style={{ marginBottom: '10px' }}>
                            <button onClick={() => handleSessionClick(session)} style={{ width: '100%' }}>
                                {session.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DashboardPage;
