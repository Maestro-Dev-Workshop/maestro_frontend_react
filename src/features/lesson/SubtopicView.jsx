import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopicContent, markSubtopicAsRead } from './lessonService';
import ReactMarkdown from 'react-markdown';
import ChatbotSidebar from './ChatbotSidebar';

const SubtopicView = () => {
    const { session_id, topic_id, subtopic_id } = useParams();
    const [subtopic, setSubtopic] = useState(null);
    const [topicTitle, setTopicTitle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const fetchSubtopic = async () => {
            setLoading(true);
            try {
                const topicData = await getTopicContent(topic_id);
                setTopicTitle(topicData.primary_topic || topicData.title || null);

                const foundSubtopic = topicData.subtopics?.find(
                    (sub) => sub.id === subtopic_id
                );

                if (foundSubtopic) {
                    setSubtopic(foundSubtopic);
                    await markSubtopicAsRead(topic_id, subtopic_id);
                } else {
                    alert('Subtopic not found');
                }
            } catch (error) {
                console.error('Failed to load subtopic:', error);
                alert('Failed to load subtopic content');
            } finally {
                setLoading(false);
            }
        };

        fetchSubtopic();
    }, [topic_id, subtopic_id]);

    const metadata = {
        topic_name: topicTitle,
        topic_id,
        sub_topic_name: subtopic?.title || null,
        sub_topic_id: subtopic_id || null,
        exercise_id: null,
        exam_id: null,
        question_id: null
    };

    if (loading) return <p>Loading subtopic...</p>;
    if (!subtopic) return <p>No content found for this subtopic.</p>;

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, paddingRight: '20px' }}>
                <h2 style={{ marginBottom: '15px', fontWeight: 'bold' }}>{subtopic.title}</h2>

                {subtopic.content && (
                    <div style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                        <ReactMarkdown>{subtopic.content}</ReactMarkdown>
                    </div>
                )}

                {subtopic.image_content?.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <h3>Images</h3>
                        {subtopic.image_content.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Subtopic Image ${idx + 1}`}
                                style={{
                                    maxWidth: '100%',
                                    marginBottom: '10px',
                                    borderRadius: '8px'
                                }}
                            />
                        ))}
                    </div>
                )}

                {subtopic.table_content?.length > 0 && (
                    <div>
                        <h3>Tables</h3>
                        {subtopic.table_content.map((table, idx) => (
                            <pre
                                key={idx}
                                style={{
                                    background: '#f5f5f5',
                                    padding: '10px',
                                    overflowX: 'auto',
                                    marginBottom: '10px',
                                    borderRadius: '5px'
                                }}
                            >
                                {table}
                            </pre>
                        ))}
                    </div>
                )}

                <button
                    style={{ marginTop: '20px', padding: '10px' }}
                    onClick={() => setShowChat(!showChat)}
                >
                    {showChat ? 'Hide Chatbot' : 'Show Chatbot'}
                </button>
            </div>

            {showChat && (
                <div
                    style={{
                        width: '350px',
                        borderLeft: '1px solid #ccc',
                        padding: '15px',
                        backgroundColor: '#f9f9f9',
                        overflowY: 'auto'
                    }}
                >
                    <ChatbotSidebar sessionId={session_id} metadata={metadata} />
                </div>
            )}
        </div>
    );
};

export default SubtopicView;
