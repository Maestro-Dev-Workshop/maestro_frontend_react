// src/features/lesson/LessonPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { getSessionTopics } from './lessonService';
import ChatbotSidebar from './ChatbotSidebar';

const LessonPage = () => {
    const { session_id } = useParams();
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            setLoading(true);
            try {
                const response = await getSessionTopics(session_id);
                setTopics(response?.topics || []);
            } catch (error) {
                console.error('Failed to fetch topics:', error);
                alert('Unable to load topics. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, [session_id]);

    const handleTopicClick = (topicId) => {
        navigate(`/lesson/${session_id}/topic/${topicId}`);
    };

    const handleExamClick = () => {
        navigate(`/lesson/${session_id}/exam`);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <div style={{
                width: '250px',
                borderRight: '1px solid #ccc',
                padding: '15px',
                overflowY: 'auto'
            }}>
                <h3>Session Navigation</h3>
                {loading ? (
                    <p>Loading topics...</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {topics.map(topic => (
                            <li key={topic.id}>
                                <button
                                    style={{ marginBottom: '8px', width: '100%' }}
                                    onClick={() => handleTopicClick(topic.id)}
                                >
                                    {topic.name}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button
                                style={{ marginTop: '15px', width: '100%' }}
                                onClick={handleExamClick}
                            >
                                Exam
                            </button>
                        </li>
                    </ul>
                )}
                <button
                    onClick={() => setShowChat(!showChat)}
                    style={{ marginTop: '20px', width: '100%' }}
                >
                    {showChat ? 'Hide Chatbot' : 'Show Chatbot'}
                </button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <Outlet />
            </div>

            {/* Chatbot Sidebar */}
            {showChat && (
                <div style={{
                    width: '350px',
                    borderLeft: '1px solid #ccc',
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    overflowY: 'auto'
                }}>
                    <ChatbotSidebar sessionId={session_id} metadata={{}} />
                </div>
            )}
        </div>
    );
};

export default LessonPage;
