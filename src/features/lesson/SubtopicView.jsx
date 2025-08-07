import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { getTopicContent, markSubtopicAsRead } from './lessonService';
import ReactMarkdown from 'react-markdown';

const SubtopicView = () => {
    const { session_id, topic_id, subtopic_id } = useParams();
    const { topic_name, topic_id: contextTopicId, setChildMetadata } = useOutletContext();
    const [subtopic, setSubtopic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubtopic = async () => {
            setLoading(true);
            try {
                const topicData = await getTopicContent(topic_id);
                const foundSubtopic = topicData.subtopics?.find(sub => sub.id === subtopic_id);
                if (foundSubtopic) {
                    setSubtopic(foundSubtopic);
                    await markSubtopicAsRead(topic_id, subtopic_id);
                } else {
                    alert('Subtopic not found');
                }
            } catch (err) {
                alert('Failed to load subtopic');
            } finally {
                setLoading(false);
            }
        };
        fetchSubtopic();
    }, [topic_id, subtopic_id]);

    const metadata = {
        topic_name: topic_name || null,
        topic_id: contextTopicId || null,
        sub_topic_name: subtopic?.title || null,
        sub_topic_id: subtopic?.id || null,
        exercise_id: null,
        exam_id: null,
        question_id: null
    };

    // ✅ Update Lesson Page metadata after subtopic loads
    useEffect(() => {
        if (subtopic) {
            setChildMetadata(metadata);
        }
    }, [subtopic]);

    if (loading) return <p>Loading subtopic...</p>;
    if (!subtopic) return <p>No content found for this subtopic.</p>;

    return (
        <div style={{ padding: '20px' }}>
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
                            style={{ maxWidth: '100%', marginBottom: '10px', borderRadius: '8px' }}
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
        </div>
    );
};

export default SubtopicView;
