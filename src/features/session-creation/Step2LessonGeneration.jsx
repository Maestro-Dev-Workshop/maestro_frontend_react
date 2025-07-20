import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { generateLesson, selectTopics } from './sessionCreationService';

const Step2LessonGeneration = () => {
    const { session_id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const identifiedTopics = location.state?.topics || [];

    const [selectedTopics, setSelectedTopics] = useState(
        identifiedTopics.map(topic => ({ name: topic, selected: true }))
    );
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
            await selectTopics(session_id, topicsToSend);
            await generateLesson(session_id, lessonPreference);
            alert('Lesson generated successfully!');
            navigate(`/session/create/step-3/${session_id}`);
        } catch (error) {
            console.error('Lesson generation failed:', error);
            alert('Failed to generate lesson. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Step 2: Lesson Generation</h1>

            <h3>Select Topics</h3>
            {selectedTopics.map((topic, index) => (
                <label key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', marginTop: '8px' }}>
                    <input
                        type="checkbox"
                        checked={topic.selected}
                        onChange={() => toggleTopicSelection(index)}
                        style={{ marginRight: '8px', width: '20px'}}
                    />
                    {topic.name}
                </label>
            ))}

            <h3>Lesson Preference</h3>
            <textarea
                value={lessonPreference}
                onChange={(e) => setLessonPreference(e.target.value)}
                placeholder="Describe how you'd like the lesson to be..."
                style={{ width: '100%', height: '100px', marginBottom: '20px' }}
            />

            <button onClick={handleGenerateLesson} disabled={loading}>
                {loading ? 'Generating Lesson...' : 'Generate Lesson'}
            </button>
        </div>
    );
};

export default Step2LessonGeneration;
