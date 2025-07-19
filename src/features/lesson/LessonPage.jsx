// src/features/lesson/LessonPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { getSessionTopics, getTopicContent } from './lessonService';
import ChatbotSidebar from './ChatbotSidebar';

const LessonPage = () => {
    const { session_id } = useParams();
    const navigate = useNavigate();

    const [topics, setTopics] = useState([]);
    const [subtopicsMap, setSubtopicsMap] = useState({});
    const [expandedTopic, setExpandedTopic] = useState(null);
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

    const toggleExpand = async (topicId) => {
        if (expandedTopic === topicId) {
            setExpandedTopic(null);
            return;
        }

        setExpandedTopic(topicId);

        if (!subtopicsMap[topicId]) {
            try {
                const topicContent = await getTopicContent(topicId);
                setSubtopicsMap(prev => ({
                    ...prev,
                    [topicId]: topicContent.sub_topics || []
                }));
            } catch (error) {
                console.error('Failed to load subtopics:', error);
                alert('Unable to load subtopics. Please try again.');
            }
        }
    };

    const handleSubtopicClick = (topicId, subtopicId) => {
        navigate(`/session/${session_id}/lesson/topic/${topicId}/subtopic/${subtopicId}`);
    };

    const handleExerciseClick = (topicId) => {
        navigate(`/session/${session_id}/lesson/topic/${topicId}/exercise`);
    };
    
    const handleExamClick = () => {
        navigate(`/session/${session_id}/lesson/exam`);
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
                        {topics.map((topic) => (
                            <li key={topic.id}>
                                <button
                                    onClick={() => toggleExpand(topic.id)}
                                    style={{
                                        width: '100%',
                                        marginBottom: '8px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {topic.title}
                                </button>
                                {expandedTopic === topic.id && (
                                    <ul style={{ marginLeft: '15px', marginTop: '5px' }}>
                                        {(subtopicsMap[topic.id] || []).map((sub) => (
                                            <li key={sub.id}>
                                                <button
                                                    style={{ width: '100%', marginBottom: '5px' }}
                                                    onClick={() => handleSubtopicClick(topic.id, sub.id)}
                                                >
                                                    {sub.title}
                                                </button>
                                            </li>
                                        ))}
                                        <li>
                                            <button
                                                style={{
                                                    width: '100%',
                                                    marginTop: '10px',
                                                    fontWeight: 'bold'
                                                }}
                                                onClick={() => handleExerciseClick(topic.id)}
                                            >
                                                Exercise
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        ))}
                        <li>
                            <button
                                style={{
                                    width: '100%',
                                    marginTop: '20px',
                                    fontWeight: 'bold',
                                    background: '#eee'
                                }}
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
