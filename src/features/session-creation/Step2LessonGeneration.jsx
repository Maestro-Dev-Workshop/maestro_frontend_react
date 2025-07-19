// src/features/session-creation/Step2LessonGeneration.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { generateLesson } from './sessionCreationService';

const Step2LessonGeneration = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const identifiedTopics = location.state?.topics || [];

    const [selectedTopics, setSelectedTopics] = useState(identifiedTopics.map(topic => ({
        name: topic,
        selected: true
    })));
    const [lessonPreference, setLessonPreference] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleTopicSelection = (index) => {
        setSelectedTopics(prev =>
            prev.map((t, i) => i === index ? { ...t, selected: !t.selected } : t)
        );
    };

    const handleGenerateLesson = async () => {
        const topicsToSend = selectedTopics.filter(t => t.selected).map(t => t.name);
        if (topicsToSend.length === 0) {
            alert('Please select at least one topic.');
            return;
        }

        setLoading(true);
        try {
            // First select topics
            await fetch(`${import.meta.env.VITE_API_URL}/session/${sessionId}/select-topics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({ topics: topicsToSend })
            });

            // Then generate lesson
            await generateLesson(sessionId, lessonPreference);
            alert('Lesson generated successfully!');
            navigate(`/session-creation/${sessionId}/step-3`);
        } catch (error) {
            alert('Failed to generate lesson.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Step 2: Lesson Generation</h1>

            <h3>Select Topics</h3>
            {selectedTopics.map((topic, index) => (
                <div key={index}>
                    <label>
                        <input
                            type="checkbox"
                            checked={topic.selected}
                            onChange={() => toggleTopicSelection(index)}
                        />
                        {topic.name}
                    </label>
                </div>
            ))}

            <h3>Lesson Preference</h3>
            <textarea
                value={lessonPreference}
                onChange={(e) => setLessonPreference(e.target.value)}
                placeholder="Describe how you'd like the lesson to be..."
                style={{ width: '100%', height: '100px' }}
            />

            <button onClick={handleGenerateLesson} disabled={loading}>
                {loading ? 'Generating Lesson...' : 'Generate Lesson'}
            </button>
        </div>
    );
};

export default Step2LessonGeneration;
