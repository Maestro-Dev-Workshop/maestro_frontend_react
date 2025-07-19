// src/features/lesson/SubtopicView.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopicContent, markSubtopicAsRead } from './lessonService';

const SubtopicView = () => {
    const { topic_id, sub_topic_id } = useParams();
    const [subtopic, setSubtopic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubtopic = async () => {
            setLoading(true);
            try {
                const topicData = await getTopicContent(topic_id);
                const foundSubtopic = topicData.sub_topics?.find(
                    (sub) => sub.id === sub_topic_id
                );

                if (foundSubtopic) {
                    setSubtopic(foundSubtopic);

                    // Mark as read after successful fetch
                    await markSubtopicAsRead(topic_id, sub_topic_id);
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
    }, [topic_id, sub_topic_id]);

    if (loading) return <p>Loading subtopic...</p>;
    if (!subtopic) return <p>No content found for this subtopic.</p>;

    return (
        <div>
            <h2>{subtopic.name}</h2>
            <div style={{ marginBottom: '20px' }}>
                <p>{subtopic.text_content}</p>
            </div>

            {subtopic.image_content?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <h3>Images</h3>
                    {subtopic.image_content.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Subtopic Image ${idx + 1}`}
                            style={{ maxWidth: '100%', marginBottom: '10px' }}
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
                            }}
                        >
                            {table}
                        </pre>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubtopicView;
