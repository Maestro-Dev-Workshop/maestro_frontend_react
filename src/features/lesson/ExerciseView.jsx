import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExercise, saveExerciseScore } from './lessonService';

const ExerciseView = () => {
    const { session_id, topic_id } = useParams();
    const navigate = useNavigate();

    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);

    useEffect(() => {
        const fetchExercise = async () => {
            setLoading(true);
            try {
                const data = await getExercise(topic_id);
                setExercise(data);
            } catch (error) {
                alert('Failed to load exercise');
            } finally {
                setLoading(false);
            }
        };

        fetchExercise();
    }, [session_id, topic_id]);

    const handleAnswerChange = (questionId, option) => {
        setAnswers({ ...answers, [questionId]: option });
    };

    const handleSubmit = async () => {
        if (!exercise?.questions?.length) return;

        let correct = 0;
        exercise.questions.forEach(q => {
            if (answers[q.id] && answers[q.id] === q.correct_answer) correct++;
        });
        const finalScore = (correct / exercise.questions.length) * 100;
        setScore(finalScore);
        setSubmitted(true);

        try {
            await saveExerciseScore(topic_id, exercise.id, finalScore);
            alert(`Exercise submitted. Score: ${finalScore.toFixed(2)}%`);
        } catch (err) {
            alert('Failed to save exercise score.');
        }
    };

    const handleNavigation = (direction) => {
        setCurrentIndex((prev) => {
            const next = direction === 'next' ? prev + 1 : prev - 1;
            if (next < 0) return 0;
            if (next >= exercise.questions.length) return exercise.questions.length - 1;
            return next;
        });
    };

    if (loading) return <p>Loading exercise...</p>;
    if (!exercise) return <p>No exercise found.</p>;

    const currentQuestion = exercise.questions[currentIndex];

    return (
        <div>
            <h2>Exercise: Question {currentIndex + 1} of {exercise.questions.length}</h2>
            <p><strong>{currentQuestion.question}</strong></p>
            {currentQuestion.options.map((opt, idx) => (
                <div key={idx}>
                    <input
                        type="radio"
                        name={`q-${currentQuestion.id}`}
                        value={opt}
                        checked={answers[currentQuestion.id] === opt}
                        onChange={() => handleAnswerChange(currentQuestion.id, opt)}
                        disabled={submitted}
                    />
                    <label>{opt}</label>
                </div>
            ))}

            <div style={{ marginTop: '20px' }}>
                <button disabled={currentIndex === 0} onClick={() => handleNavigation('prev')}>Previous</button>
                <button disabled={currentIndex === exercise.questions.length - 1} onClick={() => handleNavigation('next')} style={{ marginLeft: '10px' }}>Next</button>
            </div>

            {!submitted && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={handleSubmit}>Submit Exercise</button>
                </div>
            )}

            {score !== null && (
                <p style={{ marginTop: '20px' }}><strong>Score: {score.toFixed(2)}%</strong></p>
            )}
        </div>
    );
};

export default ExerciseView;
