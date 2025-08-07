// src/features/lesson/ExerciseView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { getExercise, saveExerciseScore, scoreEssayAnswer } from './lessonService';

const ExerciseView = () => {
    const { session_id, topic_id } = useParams();
    const { topic_name, topic_id: contextTopicId, setChildMetadata } = useOutletContext();
    const navigate = useNavigate();

    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [questionCorrectness, setQuestionCorrectness] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchExercise = async () => {
            setLoading(true);
            try {
                const data = await getExercise(topic_id);
                setExercise(data.exercise);
            } catch (error) {
                alert('Failed to load exercise');
            } finally {
                setLoading(false);
            }
        };

        fetchExercise();
    }, [session_id, topic_id]);

    const handleAnswerChange = (questionId, value, type) => {
        if (type === 'multiple selection') {
            const currentAnswers = answers[questionId] || [];
            if (currentAnswers.includes(value)) {
                setAnswers({
                    ...answers,
                    [questionId]: currentAnswers.filter(ans => ans !== value)
                });
            } else {
                setAnswers({
                    ...answers,
                    [questionId]: [...currentAnswers, value]
                });
            }
        } else {
            setAnswers({ ...answers, [questionId]: value });
        }
    };

    useEffect(() => {
        const metadata = {
            topic_name: topic_name || null,
            topic_id: contextTopicId || null,
            sub_topic_name: null,
            sub_topic_id: null,
            exercise_id: exercise?.exercise_id || null,
            exam_id: null,
            question_id: exercise?.questions?.[currentIndex]?.id || null
        };
        setChildMetadata && setChildMetadata(metadata);
    }, [topic_name, contextTopicId, exercise, currentIndex, setChildMetadata]);

    const handleSubmit = async () => {
        if (!exercise?.questions?.length) return;

        setSubmitting(true);
        let correct = 0;
        const correctnessMap = {};

        for (const q of exercise.questions) {
            const userAnswer = answers[q.id];

            if (q.type === 'multiple choice') {
                const correctOption = q.options.find(opt => opt.correct);
                const isCorrect = userAnswer === correctOption?.text;
                if (isCorrect) correct++;
                correctnessMap[q.id] = isCorrect;
            }

            if (q.type === 'multiple selection') {
                const correctAnswers = q.options.filter(opt => opt.correct).map(opt => opt.text).sort();
                const userAnswers = Array.isArray(userAnswer) ? userAnswer.sort() : [];
                const isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(userAnswers);
                if (isCorrect) correct++;
                correctnessMap[q.id] = isCorrect;
            }

            if (q.type === 'essay') {
                try {
                    const essayScore = await scoreEssayAnswer(q.id, userAnswer);
                    const isCorrect = essayScore?.result.correct;
                    if (isCorrect) correct++;
                    correctnessMap[q.id] = {
                        correct: isCorrect,
                        feedback: essayScore?.result.feedback
                    };
                } catch (err) {
                    console.error('Essay scoring failed', err);
                    correctnessMap[q.id] = { correct: false, feedback: 'Error scoring essay.' };
                }
            }
        }
        setQuestionCorrectness(correctnessMap);
        setScore(correct);
        setSubmitted(true);

        try {
            console.log(`Saving score for topic ${topic_id}, exercise ${exercise.exercise_id}, score ${correct}`);
            await saveExerciseScore(topic_id, exercise.exercise_id, correct);
            alert(`Exercise submitted. Score: ${correct}`);
        } catch (err) {
            alert('Failed to save exercise score.');
        } finally {
            setSubmitting(false);
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
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '15px' }}>Exercise: Question {currentIndex + 1} of {exercise.questions.length}</h2>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{currentQuestion.text}</p>

            {currentQuestion.type === 'multiple choice' && (
                currentQuestion.options.map((opt, idx) => (
                    <label key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', marginTop: '8px' }}>
                        <input
                            type="radio"
                            name={`q-${currentQuestion.id}`}
                            value={opt.text}
                            checked={answers[currentQuestion.id] === opt.text}
                            onChange={() => handleAnswerChange(currentQuestion.id, opt.text, currentQuestion.type)}
                            disabled={submitted}
                            style={{ marginRight: '8px', width: '20px' }}
                        />
                        {opt.text}
                    </label>
                ))
            )}

            {currentQuestion.type === 'multiple selection' && (
                currentQuestion.options.map((opt, idx) => (
                    <label key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', marginTop: '8px' }}>
                        <input
                            type="checkbox"
                            name={`q-${currentQuestion.id}`}
                            value={opt.text}
                            checked={(answers[currentQuestion.id] || []).includes(opt.text)}
                            onChange={() => handleAnswerChange(currentQuestion.id, opt.text, currentQuestion.type)}
                            disabled={submitted}
                            style={{ marginRight: '8px', width: '20px' }}
                        />
                        {opt.text}
                    </label>
                ))
            )}

            {currentQuestion.type === 'essay' && (
                <textarea
                    rows="5"
                    style={{ width: '100%', marginBottom: '15px' }}
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value, currentQuestion.type)}
                    disabled={submitted}
                />
            )}

            {submitted && (
                <p style={{
                    marginTop: '10px',
                    fontWeight: 'bold',
                    color: (questionCorrectness[currentQuestion.id]?.correct || questionCorrectness[currentQuestion.id] === true) ? 'green' : 'red'
                }}>
                    {(questionCorrectness[currentQuestion.id]?.correct || questionCorrectness[currentQuestion.id] === true) ? 'Correct' : 'Incorrect'}
                </p>
            )}

            {submitted && currentQuestion.type === 'multiple choice' && (
                <p style={{ fontStyle: 'italic', marginTop: '5px' }}>
                    Explanation: {currentQuestion.options.find(opt => opt.correct)?.explanation}
                </p>
            )}

            {submitted && currentQuestion.type === 'multiple selection' && (
                <div style={{ fontStyle: 'italic', marginTop: '5px' }}>
                    <p><strong>Explanations:</strong></p>
                    {currentQuestion.options.map((opt, idx) => (
                        <p key={idx} style={{ marginBottom: '5px' }}>
                            <span style={{ fontWeight: 'bold' }}>{opt.text}:</span> {opt.explanation}
                        </p>
                    ))}
                </div>
            )}

            {submitted && currentQuestion.type === 'essay' && (
                <p style={{ fontStyle: 'italic', marginTop: '5px' }}>
                    Feedback: {questionCorrectness[currentQuestion.id]?.feedback}
                </p>
            )}

            <div style={{ marginTop: '20px' }}>
                <button disabled={currentIndex === 0} onClick={() => handleNavigation('prev')}>Previous</button>
                <button
                    disabled={currentIndex === exercise.questions.length - 1}
                    onClick={() => handleNavigation('next')}
                    style={{ marginLeft: '10px' }}
                >
                    Next
                </button>
            </div>

            {!submitted && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Exercise'}
                    </button>
                </div>
            )}

            {score !== null && (
                <div style={{ marginTop: '20px' }}>
                    <p style={{ fontWeight: 'bold' }}>Score: {score}</p>
                    <button onClick={() => navigate(`/lesson/${session_id}`)}>Back to Lesson Overview</button>
                </div>
            )}
        </div>
    );
};

export default ExerciseView;
